const path = require('path');
const express = require('express');
const xss = require('xss');
const TeamsService = require('./teams-service');
const teamRouter = express.Router();
const jsonBodyParser = express.json();

const serializeTeam = teams => ({
    teamid: teams.teamid,
    teamname: xss(teams.teamname),
    teamabr: xss(teams.teamabr),
    captainid: teams.captainid,
    captain: teams.captain,
    topid: teams.topid,
    top: teams.top,
    jungleid: teams.jungleid,
    jungle: teams.jungle,
    midid: teams.midid,
    mid: teams.mid,
    adcid: teams.adcid,
    adc: teams.adc,
    supportid: teams.supportid,
    support: teams.support
});

teamRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        TeamsService.getAllTeams(knexInstance)
            .then(teams => {
                res.json(teams.map(serializeTeam));
            })
            .catch(next);
    })
    .post(jsonBodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const { teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support } = req.body;
        const newTeam = { teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support };

        for (const [key, value] of Object.entries(newTeam))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });

        TeamsService.insertNote(knexInstance, newTeam)
            .then(teams => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${teams.id}`))
                    .json(serializeTeam(teams));
            })
            .catch(next);
    });
/*
app.get('/teams', async (req, res) => {
try {
    const allTeams = await pool.query('SELECT * FROM teams');
    res.json(allTeams.rows);
} catch (err) {
    console.error(err.message);
}
})
app.post('/teams', async (req, res) => {
try {
    const { teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support } = req.body;
    const newTeam = await pool.query('INSERT INTO teams (teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support]);
    res.json(newTeam.rows[0]);
} catch (err) {
    console.error(err.message);
}
})
*/
teamRouter
    .route('/:id')
    .all((req, res, next) => {
        TeamsService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(team => {
                if (!team) {
                    return res.status(404).json({
                        error: { message: 'Team does not exist' }
                    });
                }
                res.team = team;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeTeam(res.team));
    })
    .delete((req, res, next) => {
        TeamsService.deleteTeam(req.app.get('db'), req.params.id)
            .then((numRowsAffected) => {
                return res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support } = req.body;
        const newTeamFields = { teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support };

        const numOfValues = Object.values(newTeamFields).filter(Boolean).length;
        if (numOfValues === 0) {
            return res
                .status(400)
                .json({
                    error: {
                        message:
                            'Your response must include one of the following fields: teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support',
                    },
                });
        }

        TeamsService.updateTeam(
            req.app.get('db'),
            req.params.id,
            newTeamFields
        )
            .then((numRowsAffected) => {
                return res.status(204).end();
            })
            .catch(next);
    });
/*
app.get('/teams/:id', async (req, res) => {
try {
    const { id } = req.params;
    const team = await pool.query('SELECT * FROM teams WHERE teamid = $1', [id]);
    res.json(team.rows[0]);
} catch (err) {
    console.error(err.message);
}
})
app.delete('/teams/:id', async (req, res) => {
try {
    const { id } = req.params;
    const deleteTeam = await pool.query('DELETE FROM teams WHERE teamid = $1', [id]);
    res.json('Team was deleted!');
} catch (err) {
    console.error(err.message);
}
})
app.put('/teams/:id', async (req, res) => {
try {
    const { id } = req.params;
    const { teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support } = req.body;
    if (teamname) await pool.query('UPDATE teams SET teamname = $1 WHERE teamid = $2', [teamname, id]);
    if (teamabr) await pool.query('UPDATE teams SET teamabr = $1 WHERE teamid = $2', [teamabr, id]);
    if (captainid) await pool.query('UPDATE teams SET captainid = $1 WHERE teamid = $2', [captainid, id]);
    if (captain) await pool.query('UPDATE teams SET captain = $1 WHERE teamid = $2', [captain, id]);
    if (topid) await pool.query('UPDATE teams SET topid = $1 WHERE teamid = $2', [topid, id]);
    if (top) await pool.query('UPDATE teams SET top = $1 WHERE teamid = $2', [top, id]);
    if (topid) await pool.query('UPDATE teams SET topid = $1 WHERE teamid = $2', [topid, id]);
    if (jungleid) await pool.query('UPDATE teams SET jungleid = $1 WHERE teamid = $2', [jungleid, id]);
    if (jungle) await pool.query('UPDATE teams SET jungle = $1 WHERE teamid = $2', [jungle, id]);
    if (midid) await pool.query('UPDATE teams SET midid = $1 WHERE teamid = $2', [midid, id]);
    if (mid) await pool.query('UPDATE teams SET mid = $1 WHERE teamid = $2', [mid, id]);
    if (adcid) await pool.query('UPDATE teams SET adcid = $1 WHERE teamid = $2', [adcid, id]);
    if (adc) await pool.query('UPDATE teams SET adc = $1 WHERE teamid = $2', [adc, id]);
    if (supportid) await pool.query('UPDATE teams SET supportid = $1 WHERE teamid = $2', [supportid, id]);
    if (support) await pool.query('UPDATE teams SET support = $1 WHERE teamid = $2', [support, id]);
    res.json('League team was updated!');
} catch (err) {
    console.error(err.message);
}
})
*/


module.exports = teamRouter;