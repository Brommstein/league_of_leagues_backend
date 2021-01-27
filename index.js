const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//ROUTES//

//USERS
//create a user

app.post('/users', async (req, res) => {
    try {
        const { leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday } = req.body;
        const newUser = await pool.query('INSERT INTO users (leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday]);
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//get all users

app.get('/users', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a user

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await pool.query('SELECT * FROM users WHERE userid = $1', [id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//update a user

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday } = req.body;
        const updateUser = await pool.query('UPDATE users SET leaguename = $1, preferedrole = $2, secondaryrole = $3, sunday = $4, monday = $5, tuesday = $6, wednesday = $7, thursday = $8, friday = $9, saturday = $10 WHERE userid = $11', [leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday, id]);
        res.json('League user was updated!');
    } catch (err) {
        console.error(err.message);
    }
})

//delete a user

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await pool.query('DELETE FROM users WHERE userid = $1', [id]);
        res.json('User was deleted!');
    } catch (err) {
        console.error(err.message);
    }
})

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//TEAMS
//create a team

app.post('/teams', async (req, res) => {
    try {
        const { teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support } = req.body;
        const newTeam = await pool.query('INSERT INTO teams (teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support]);
        res.json(newTeam.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//get all teams

app.get('/teams', async (req, res) => {
    try {
        const allTeams = await pool.query('SELECT * FROM teams');
        res.json(allTeams.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a team
app.get('/teams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const team = await pool.query('SELECT * FROM teams WHERE teamid = $1', [id]);
        res.json(team.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//update a team

app.put('/teams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support } = req.body;
        const updateTeam = await pool.query('UPDATE teams SET teamname = $1, teamabr = $2, captainid = $3, captain = $4, topid = $5, top = $6, jungleid = $7, jungle = $8, midid = $9, mid = $10, adcid = $11, adc = $12, supportid = $13 support = $14 WHERE teamid = $14', [teamname, teamabr, captainid, captain, topid, top, jungleid, jungle, midid, mid, adcid, adc, supportid, support, id]);
        res.json('League team was updated!');
    } catch (err) {
        console.error(err.message);
    }
})

//delete a team

app.delete('/teams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTeam = await pool.query('DELETE FROM teams WHERE teamid = $1', [id]);
        res.json('Team was deleted!');
    } catch (err) {
        console.error(err.message);
    }
})

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//USERSTATUS
//create a status

app.post('/userstatus', async (req, res) => {
    try {
        const { user, leader, admin } = req.body;
        const newuserstatus = await pool.query('INSERT INTO userstatus (user, leader, admin) VALUES($1, $2, $3)', [user, leader, admin]);
        res.json(newuserstatus.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//get all statuses

app.get('/userstatus', async (req, res) => {
    try {
        const alluserstatus = await pool.query('SELECT * FROM userstatus');
        res.json(alluserstatus.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a status

app.get('/userstatus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const status = await pool.query('SELECT * FROM userstatus WHERE userid = $1', [id]);
        res.json(status.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//update a status

app.put('/userstatus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user, leader, admin } = req.body;
        const updateuserstatus = await pool.query('UPDATE userstatus SET user = $1, leader = $2, admin = $3 WHERE userid = $4', [user, leader, admin, id]);
        res.json('User status was updated!');
    } catch (err) {
        console.error(err.message);
    }
})

//delete a status

app.delete('/userstatus/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deleteuserstatus = await pool.query('DELETE FROM userstatus WHERE userid = $1', [id]);
        res.json('User status was deleted!');
    } catch (err) {
        console.error(err.message);
    }
})

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});