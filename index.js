const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());

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
        const { captain, top, jungle, mid, adc, support, teamname, captainid, topid, jungleid, midid, adcid, supportid } = req.body;
        const newTeam = await pool.query('INSERT INTO teams (captain, top, jungle, mid, adc, support, teamname, captainid, topid, jungleid, midid, adcid, supportid) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [captain, top, jungle, mid, adc, support, teamname, captainid, topid, jungleid, midid, adcid, supportid]);
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
        const { captain, top, jungle, mid, adc, support, teamname, captainid, topid, jungleid, midid, adcid, supportid } = req.body;
        const updateTeam = await pool.query('UPDATE teams SET captain = $1, top = $2, jungle = $3, mid = $4, adc = $5, support = $6, teamname = $7, captainid = $8, topid = $9, jungleid = $10, midid = $11, adcid = $12, supportid = $13 WHERE teamid = $14', [captain, top, jungle, mid, adc, support, teamname, captainid, topid, jungleid, midid, adcid, supportid, id]);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});