const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//
//create a user

app.post('/users', async (req, res) => {
    try {
        const { leaguename, preferedrole, secondaryrole } = req.body;
        const newUser = await pool.query('INSERT INTO users (leaguename, preferedrole, secondaryrole) VALUES($1, $2, $3)', [leaguename, preferedrole, secondaryrole]);
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
        const { leaguename } = req.body;
        const updateUser = await pool.query('UPDATE users SET leaguename = $1 WHERE userid = $2', [leaguename, id]);
        res.json('League name was updated!');
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

app.listen(5000, () => {
    console.log("Server has started on port 5000");
});