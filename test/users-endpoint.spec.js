const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');
const { makeUser, makeTestUser, createUser, emptyUser, makeMaliciousImg } = require('./users.fixtures');



describe('Users Endpoints', () => {

    before('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'));

    describe('/GET /users', () => {
        context('given no users in the database', () => {
            it('returns a 200 and an empty list', () => {
                return supertest(app)
                    .get('/users')
                    .expect(200, []);
            });
        });

        context('given users in the database', () => {
            const testUsers = makeUser();

            beforeEach('insert users', () => {
                return db.into('users')
                    .insert(testUsers);
            });

            it('returns with a 200 and the array of users', () => {
                return supertest(app)
                    .get('/users')
                    .expect(200)
                    .expect(res => {
                        console.log(res.body)
                        let obj = 0;
                        res.body.forEach((user) => {
                            if (user.hasOwnProperty('userid')) { obj++ };
                        })
                        expect(obj).to.eql(3);
                        expect(res.body.leaguename).to.eql(testUsers.leaguename)
                        expect(res.body.preferedrole).to.eql(testUsers.preferedrole)
                        expect(res.body.secondaryrole).to.eql(testUsers.secondaryrole)
                        expect(res.body.sunday).to.eql(testUsers.sunday)
                        expect(res.body.monday).to.eql(testUsers.monday)
                        expect(res.body.tuesday).to.eql(testUsers.tuesday)
                        expect(res.body.wednesday).to.eql(testUsers.wednesday)
                        expect(res.body.thursday).to.eql(testUsers.thursday)
                        expect(res.body.friday).to.eql(testUsers.friday)
                        expect(res.body.saturday).to.eql(testUsers.saturday)
                        expect(res.body.team).to.eql(testUsers.team)
                    });
            });
        });
    });

    describe('GET /users/:id', () => {
        context('given no users in the database', () => {
            it('returns a 404 and an error for the users', () => {
                const testID = 1612;

                return supertest(app)
                    .get(`/users/${testID}`)
                    .expect(404)
                    .expect({
                        error: { message: 'User does not exist' }
                    });
            });
        });

        context('given users in the database', () => {
            const testUsers = makeUser();

            beforeEach('insert users', () => {
                return db.into('users')
                    .insert(testUsers);
            });

            if ('returns a 200 and the expected users', () => {
                const testId = 2;
                const expectedAccount = testUsers[testId - 1];

                return supertest(app)
                    .get(`/users/${testId}`)
                    .expect(200, expectedAccount);
            });
        });
    });

    describe('POST /users', () => {
        it('creates an users responding with a 201 then the new users', () => {
            const nUser = createUser();

            return supertest(app)
                .post('/users')
                .send(nUser)
                .expect(201)
                .expect(res => {
                    console.log(res.body)
                    expect(res.body).to.have.property('userid')
                    expect(res.body.leaguename).to.eql(nUser.leaguename)
                    expect(res.body.preferedrole).to.eql(nUser.preferedrole)
                    expect(res.body.secondaryrole).to.eql(nUser.secondaryrole)
                    expect(res.body.sunday).to.eql(nUser.sunday)
                    expect(res.body.monday).to.eql(nUser.monday)
                    expect(res.body.tuesday).to.eql(nUser.tuesday)
                    expect(res.body.wednesday).to.eql(nUser.wednesday)
                    expect(res.body.thursday).to.eql(nUser.thursday)
                    expect(res.body.friday).to.eql(nUser.friday)
                    expect(res.body.saturday).to.eql(nUser.saturday)
                    expect(res.body.team).to.eql(nUser.team)
                })
                .then(postRes => {
                    return supertest(app)
                        .get(`/users/${postRes.body.userid}`)
                        .expect(postRes.body);
                });
        });

        it('rejectes an users with no sunday, sending a 400 and error', () => {
            const emptyUsers = emptyUser();

            return supertest(app)
                .post('/users')
                .send(emptyUsers)
                .expect(400)
                .expect({
                    error: { message: `Missing 'sunday'` }
                });
        });

        it('Sanitizes and xss attack', () => {
            const { maliciousImg, expectedImg } = makeMaliciousImg();

            return supertest(app)
                .post('/users')
                .send(maliciousImg)
                .expect(201)
                .expect(res => {
                    expect(res.body.leaguename).to.eql(expectedImg.leaguename);
                });
        });
    });

    describe('DELETE /users/:id', () => {
        context('given no user in the database', () => {
            it('retuns a 404 and an error for the folder', () => {
                const testId = 1612;

                return supertest(app)
                    .delete(`/users/${testId}`)
                    .expect(404)
                    .expect({
                        error: { message: 'User does not exist' }
                    });
            });
        });

        context('given users in the database', () => {
            const test = makeTestUser();

            beforeEach('Add users to the database', () => {
                return db.into('users')
                    .insert(test);
            });

            it('deletes the users and returns a 204', () => {
                const testId = 2;
                const expectedStatus = test.filter(folder => folder.id != testId);

                return supertest(app)
                    .delete(`/users/${testId}`)
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get('/users')
                            .expect(expectedStatus)
                    });
            });
        });
    });

    describe('PATCH /users/:id', () => {
        context('when there are no items in the database', () => {
            it('retuns a 404 and an error for the folder', () => {
                const testId = 1612;

                return supertest(app)
                    .patch(`/users/${testId}`)
                    .expect(404)
                    .expect({
                        error: { message: 'User does not exist' }
                    });
            });
        });

        context('When items are in the database', () => {
            const testUsers = makeUser();
            beforeEach('Add users to database', () => {
                return db.into('users')
                    .insert(testUsers);
            });

            it('updates the users name with a 204', () => {
                const idToUpdate = 2;
                const updateUser = {
                    sunday: true,
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: true,
                    friday: false,
                    saturday: true
                };
                const expectedStatus = {
                    ...testUsers[idToUpdate - 1],
                    ...updateUser
                };

                return supertest(app)
                    .patch(`/users/${idToUpdate}`)
                    .send(updateUser)
                    .expect(204)
                    .then(res => {
                        console.log('res', res.body)
                        supertest(app)
                            .get(`/users/${idToUpdate}`)
                            .expect(expectedStatus)
                    });
            });

            it('returns a 400 and error when there is nothing to update', () => {
                const idToUpdate = 2;
                const updateUser = {
                    sunday: '',
                    monday: '',
                    tuesday: '',
                    wednesday: '',
                    thursday: '',
                    friday: '',
                    saturday: ''
                };
                const expectedStatus = {
                    ...testUsers[idToUpdate - 1],
                    ...updateUser
                };

                return supertest(app)
                    .patch(`/users/${idToUpdate}`)
                    .send(updateUser)
                    .expect(400)
                    .expect({
                        error: {
                            message:
                                'Your response must include one of the following fields: leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday',
                        }
                    });
            });
        });
    });
});
