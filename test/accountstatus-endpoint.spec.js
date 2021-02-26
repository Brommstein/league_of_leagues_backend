const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeAccountStatus, createAccount, emptyAccount, makeMaliciousImg } = require('./accountstatus.fixtures');

describe('Accountstatus Endpoints', () => {
    let db;

    before('Make the knex instancec', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('Disconnect from the database', () => db.destroy());

    before('clean the table', () => db.raw('TRUNCATE accountstatus RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE accountstatus RESTART IDENTITY CASCADE'));

    describe('/GET /accountstatus', () => {
        context('given no accountstatus in the database', () => {
            it('returns a 200 and an empty list', () => {
                return supertest(app)
                    .get('/accountstatus')
                    .expect(200, []);
            });
        });

        context('given accountstatus in the database', () => {
            const testAccountStatus = makeAccountStatus();

            beforeEach('insert accountstatus', () => {
                return db.into('accountstatus')
                    .insert(testAccountStatus);
            });

            it('returns with a 200 and the array of folder', () => {
                return supertest(app)
                    .get('/accountstatus')
                    .expect(200, testAccountStatus);
            });
        });
    });

    describe('GET /accountstatus/:id', () => {
        context('given no accountstatus in the database', () => {
            it('returns a 404 and an error for the accountstatus', () => {
                const testID = 1612;

                return supertest(app)
                    .get(`/accountstatus/${testID}`)
                    .expect(404)
                    .expect({
                        error: { message: 'Account status does not exist' }
                    });
            });
        });

        context('given accountstatus in the database', () => {
            const testAccountStatus = makeAccountStatus();

            beforeEach('insert accountstatus', () => {
                return db.into('accountstatus')
                    .insert(testAccountStatus);
            });

            if ('returns a 200 and the expected accountstatus', () => {
                const testId = 2;
                const expectedAccount = testAccountStatus[testId - 1];

                return supertest(app)
                    .get(`/accountstatus/${testId}`)
                    .expect(200, expectedAccount);
            });
        });
    });

    describe('POST /accountstatus', () => {
        it('creates an accountstatus responding with a 201 then the new accountstatus', () => {
            const newAccountstatus = createAccount();

            return supertest(app)
                .post('/accountstatus')
                .send(newAccountstatus)
                .expect(201)
                .expect(res => {
                    expect(res.body.userid).to.eql(newAccountstatus.userid)
                    expect(res.body.username).to.eql(newAccountstatus.username)
                    //skipped password because it gets bcrypt'ed
                    expect(res.body._status).to.eql(newAccountstatus._status)
                })
                .then(postRes => {
                    return supertest(app)
                        .get(`/accountstatus/${postRes.body.userid}`)
                        .expect(postRes.body);
                });
        });

        it('rejectes an accountstatus with no username, sending a 400 and error', () => {
            const emptyAccountStatus = emptyAccount();

            return supertest(app)
                .post('/accountstatus')
                .send(emptyAccountStatus)
                .expect(400)
                .expect({
                    error: { message: `Missing username` }
                });
        });

        it('Sanitizes and xss attack', () => {
            const { maliciousImg, expectedImg } = makeMaliciousImg();

            return supertest(app)
                .post('/accountstatus')
                .send(maliciousImg)
                .expect(201)
                .expect(res => {
                    expect(res.body.username).to.eql(expectedImg.username);
                });
        });
    });

    describe('DELETE /accountstatus/:id', () => {
        context('given no user in the database', () => {
            it('retuns a 404 and an error for the folder', () => {
                const testId = 1612;

                return supertest(app)
                    .delete(`/accountstatus/${testId}`)
                    .expect(404)
                    .expect({
                        error: { message: 'Account status does not exist' }
                    });
            });
        });

        context('given accountstatus in the database', () => {
            const test = makeAccountStatus();

            beforeEach('Add accountstatus to the database', () => {
                return db.into('accountstatus')
                    .insert(test);
            });

            it('deletes the accountstatus and returns a 204', () => {
                const testId = 2;
                const expectedStatus = test.filter(folder => folder.userid != testId);

                return supertest(app)
                    .delete(`/accountstatus/${testId}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get('/accountstatus')
                            .expect(expectedStatus)
                    );
            });
        });
    });

    describe('PATCH /accountstatus/:id', () => {
        context('when there are no items in the database', () => {
            it('retuns a 404 and an error for the folder', () => {
                const testId = 1612;

                return supertest(app)
                    .patch(`/accountstatus/${testId}`)
                    .expect(404)
                    .expect({
                        error: { message: 'Account status does not exist' }
                    });
            });
        });

        context('When items are in the database', () => {
            const testStatus = makeAccountStatus();
            beforeEach('Add accountstatus to database', () => {
                return db.into('accountstatus')
                    .insert(testStatus);
            });

            it('updates the accountstatus name with a 204', () => {
                const idToUpdate = 2;
                const updateStatus = {
                    _status: 'Test'
                };
                const expectedStatus = {
                    ...testStatus[idToUpdate - 1],
                    ...updateStatus
                };

                return supertest(app)
                    .patch(`/accountstatus/${idToUpdate}`)
                    .send(updateStatus)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/accountstatus/${idToUpdate}`)
                            .expect(expectedStatus)
                    )
            });

            it('returns a 400 and error when there is nothing to update', () => {
                const idToUpdate = 2;
                const updateStatus = {
                    _status: ''
                };
                const expectedStatus = {
                    ...testStatus[idToUpdate - 1],
                    ...updateStatus
                };

                return supertest(app)
                    .patch(`/accountstatus/${idToUpdate}`)
                    .send(updateStatus)
                    .expect(400)
                    .expect({
                        error: {
                            message: 'Your response must include a status.'
                        }
                    });
            });
        });
    });
});