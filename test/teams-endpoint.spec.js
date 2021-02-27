const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');
const { makeTeam, makeTestTeam, createTeam, emptyTeam, makeMaliciousImg } = require('./teams.fixtures');

describe('Teams Endpoints', () => {

    before('clean the table', () => db.raw('TRUNCATE teams RESTART IDENTITY CASCADE'));

    afterEach('cleanup', () => db.raw('TRUNCATE teams RESTART IDENTITY CASCADE'));

    describe('/GET /teams', () => {
        context('given no teams in the database', () => {
            it('returns a 200 and an empty list', () => {
                return supertest(app)
                    .get('/teams')
                    .expect(200, []);
            });
        });

        context('given teams in the database', () => {
            const testTeams = makeTeam();

            beforeEach('insert teams', () => {
                return db.into('teams')
                    .insert(testTeams);
            });

            it('returns with a 200 and the object of teams', () => {
                return supertest(app)
                    .get('/teams')
                    .expect(200)
                    .expect(res => {
                        let obj = 0;
                        res.body.forEach((team) => {
                            if (team.hasOwnProperty('teamid')) { obj++ };
                        })
                        expect(obj).to.eql(3);
                        expect(res.body.teamname).to.eql(testTeams.teamname)
                        expect(res.body.teamabr).to.eql(testTeams.teamabr)
                        expect(res.body.captainid).to.eql(testTeams.captainid)
                        expect(res.body.captain).to.eql(testTeams.captain)
                        expect(res.body.topid).to.eql(testTeams.topid)
                        expect(res.body._top).to.eql(testTeams._top)
                        expect(res.body.jungleid).to.eql(testTeams.jungleid)
                        expect(res.body.jungle).to.eql(testTeams.jungle)
                        expect(res.body.midid).to.eql(testTeams.midid)
                        expect(res.body.mid).to.eql(testTeams.mid)
                        expect(res.body.adcid).to.eql(testTeams.adcid)
                        expect(res.body.adc).to.eql(testTeams.adc)
                        expect(res.body.supportid).to.eql(testTeams.supportid)
                        expect(res.body.support).to.eql(testTeams.support)
                    });
            });
        });
    });

    describe('GET /teams/:id', () => {
        context('given no teams in the database', () => {
            it('returns a 404 and an error for the teams', () => {
                const testID = 1612;

                return supertest(app)
                    .get(`/teams/${testID}`)
                    .expect(404)
                    .expect({
                        error: { message: 'Team does not exist' }
                    });
            });
        });

        context('given teams in the database', () => {
            const testTeams = makeTeam();

            beforeEach('insert teams', () => {
                return db.into('teams')
                    .insert(testTeams);
            });

            if ('returns a 200 and the expected teams', () => {
                const testId = 2;
                const expectedAccount = testTeams[testId - 1];

                return supertest(app)
                    .get(`/teams/${testId}`)
                    .expect(200, expectedAccount);
            });
        });
    });

    describe('POST /teams', () => {
        it('creates a teams responding with a 201 then the new teams', () => {
            const newTeams = createTeam();

            return supertest(app)
                .post('/teams')
                .send(newTeams)
                .expect(201)
                .expect(res => {
                    console.log(res.body)
                    expect(res.body).to.have.property('teamid')
                    expect(res.body.teamname).to.eql(newTeams.teamname)
                    expect(res.body.teamabr).to.eql(newTeams.teamabr)
                    expect(res.body.captainid).to.eql(newTeams.captainid)
                    expect(res.body.captain).to.eql(newTeams.captain)
                    expect(res.body.topid).to.eql(newTeams.topid)
                    expect(res.body.top).to.eql(newTeams.top)
                    expect(res.body.jungleid).to.eql(newTeams.jungleid)
                    expect(res.body.jungle).to.eql(newTeams.jungle)
                    expect(res.body.adcid).to.eql(newTeams.adcid)
                    expect(res.body.adc).to.eql(newTeams.adc)
                    expect(res.body.supportid).to.eql(newTeams.supportid)
                    expect(res.body.support).to.eql(newTeams.support)
                })
                .then(postRes => {
                    return supertest(app)
                        .get(`/teams/${postRes.body.teamid}`)
                        .expect(postRes.body);
                });
        });

        it('rejectes a teams with no _top, sending a 400 and error', () => {
            const _emptyTeam = emptyTeam();

            return supertest(app)
                .post('/teams')
                .send(_emptyTeam)
                .expect(400)
                .expect({
                    error: { message: `Missing '_top'` }
                });
        });

        it('Sanitizes and xss attack', () => {
            const { maliciousImg, expectedImg } = makeMaliciousImg();

            return supertest(app)
                .post('/teams')
                .send(maliciousImg)
                .expect(201)
                .expect(res => {
                    expect(res.body.teamname).to.eql(expectedImg.teamname);
                    expect(res.body.teamabr).to.eql(expectedImg.teamabr);
                });
        });
    });

    describe('DELETE /teams/:id', () => {
        context('given no teams in the database', () => {
            it('retuns a 404 and an error for the folder', () => {
                const testId = 1612;

                return supertest(app)
                    .delete(`/teams/${testId}`)
                    .expect(404)
                    .expect({
                        error: { message: 'Team does not exist' }
                    });
            });
        });

        context('given teams in the database', () => {
            const test = makeTestTeam();

            beforeEach('Add teams to the database', () => {
                return db.into('teams')
                    .insert(test);
            });

            it('deletes the teams and returns a 204', () => {
                const testId = 2;
                const expectedTeam = test.filter(folder => folder.teamid != testId);

                console.log('expectedTeam', expectedTeam);

                return supertest(app)
                    .delete(`/teams/${testId}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get('/teams')
                            .expect(expectedTeam)
                    );
            });
        });
    });

    describe('PATCH /teams/:id', () => {
        context('when there are no items in the database', () => {
            it('retuns a 404 and an error for the folder', () => {
                const testId = 1612;

                return supertest(app)
                    .patch(`/teams/${testId}`)
                    .expect(404)
                    .expect({
                        error: { message: 'Team does not exist' }
                    });
            });
        });

        context('When items are in the database', () => {
            const testTeams = makeTestTeam();
            beforeEach('Add teams to database', () => {
                return db.into('teams')
                    .insert(testTeams);
            });

            it('updates the teams name with a 204', () => {
                const idToUpdate = 2;
                const updateTeam = {
                    mid: 'updated'
                };
                const expectedTeam = {
                    ...testTeams[idToUpdate - 1],
                    ...updateTeam
                };

                return supertest(app)
                    .patch(`/teams/${idToUpdate}`)
                    .send(updateTeam)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/teams/${idToUpdate}`)
                            .expect(expectedTeam)
                    )
            });

            it('returns a 400 and error when there is nothing to update', () => {
                const idToUpdate = 2;
                const updateTeam = {};

                const expectedTeam = {
                    ...testTeams[idToUpdate - 1],
                    ...updateTeam
                };

                return supertest(app)
                    .patch(`/teams/${idToUpdate}`)
                    .send(updateTeam)
                    .expect(400)
                    .expect({
                        error: {
                            message:
                                "You didn't make any changes.",
                        },
                    });
            });
        });
    });
});
