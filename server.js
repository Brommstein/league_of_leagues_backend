const pool = require('./db'); //might get rid of
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const saltRounds = 10;

//middleware
const auth = require('./middleware/auth');
app.use(express.json());

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const knex = require('knex');
const app = require('./app');
const { PORT, DATABASE_URL, JWTSECRET } = require('./config');
if (process.env.NODE_ENV === "production") {
    const pg = require('pg');
    pg.defaults.ssl = { rejectUnauthorized: false }
}

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});

app.set('db', db);

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

//ROUTES//
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//USERS
//create a user

app.post('/users', async (req, res) => {
    try {

        const { leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday, team } = req.body;

        //Check for all needed data
        if (!leaguename || !preferedrole || !team) return res.status(400).json({ msg: 'Please enter all fields...' });

        //Check if user already exists
        const usercheck = await pool.query('SELECT * FROM users');

        for (let i = 0; i < usercheck.rows.length; i++) {
            if (usercheck.rows[i].leaguename === leaguename) {
                return res.status(400).json({ msg: 'User already exists...' });
            }
        }

        //Send data to db
        const newUser = await pool.query('INSERT INTO users (leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday, team) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday, team]);
        return res.json('New user created!');

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

app.put('/users/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday } = req.body;

        if (leaguename) await pool.query('UPDATE users SET leaguename = $1 WHERE userid = $2', [leaguename, id]);
        if (preferedrole) await pool.query('UPDATE users SET preferedrole = $1 WHERE userid = $2', [preferedrole, id]);
        if (secondaryrole) await pool.query('UPDATE users SET secondaryrole = $1 WHERE userid = $2', [secondaryrole, id]);

        //If user changed secondary to null
        const secondarynull = await pool.query('SELECT secondaryrole FROM users WHERE userid = $1', [id]);
        if (secondaryrole !== secondarynull.rows[0].secondaryrole) await pool.query("UPDATE users SET secondaryrole = '' WHERE userid = $1", [id]);

        if (sunday) await pool.query('UPDATE users SET sunday = $1 WHERE userid = $2', [sunday, id]);
        if (monday) await pool.query('UPDATE users SET monday = $1 WHERE userid = $2', [monday, id]);
        if (tuesday) await pool.query('UPDATE users SET tuesday = $1 WHERE userid = $2', [tuesday, id]);
        if (wednesday) await pool.query('UPDATE users SET wednesday = $1 WHERE userid = $2', [wednesday, id]);
        if (thursday) await pool.query('UPDATE users SET thursday = $1 WHERE userid = $2', [thursday, id]);
        if (friday) await pool.query('UPDATE users SET friday = $1 WHERE userid = $2', [friday, id]);
        if (saturday) await pool.query('UPDATE users SET saturday = $1 WHERE userid = $2', [saturday, id]);

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

//TEAM UPDATE
//update a user's team

app.put('/teamupdate/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { team } = req.body;
        const updateteam = await pool.query('UPDATE users SET team = $1 WHERE userid = $2', [team, id])
        res.json('User team was updated!')
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

app.post('/accountstatus', async (req, res) => {
    const { userid, username, password, status } = req.body;
    try {
        await bcrypt.hash(password, saltRounds, async function (err, hash) {
            if (err) throw err;
            const newaccountstatus = await pool.query('INSERT INTO accountstatus (userid, username, password, status) VALUES($1, $2, $3, $4)', [userid, username, hash, status]);
            jwt.sign(
                {
                    id: userid,
                    name: username,
                    status: status
                },
                JWTSECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            id: userid,
                            username: username,
                            status: status
                        }
                    })
                }
            )
        });
    } catch (err) {
        console.error(err.message);
    }
})

//get all statuses

app.get('/accountstatus', async (req, res) => {
    try {
        const allaccountstatus = await pool.query('SELECT * FROM accountstatus');
        res.json(allaccountstatus.rows);
    } catch (err) {
        console.error(err.message);
    }
})

//get a status

app.get('/accountstatus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const status = await pool.query('SELECT * FROM accountstatus WHERE userid = $1', [id]);
        res.json(status.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

//update a user to captain

app.put('/accountstatus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const checkadmin = await pool.query('SELECT * FROM accountstatus WHERE userid = $1', [id]);
        if (checkadmin.rows[0].status === 'Admin') res.json('User is an admin');
        if (checkadmin.rows[0].status !== 'Admin') {
            const updateaccountstatus = await pool.query('UPDATE accountstatus SET status = $1 WHERE userid = $2', [status, id]);
            res.json('User status was updated!');
        }
    } catch (err) {
        console.error(err.message);
    }
})

//delete a status

app.delete('/accountstatus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteaccountstatus = await pool.query('DELETE FROM accountstatus WHERE userid = $1', [id]);
        res.json('User status was deleted!');
    } catch (err) {
        console.error(err.message);
    }
})

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//USERLOGIN
//Check user login

app.post('/auth', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Please enter all fields...' });

        //Find user in database
        const user = await pool.query(`SELECT * FROM accountstatus WHERE username=$1`, [username]);
        if (!user.rows) return res.status(400).json({ message: 'User does not exist...' });

        //Validate password
        bcrypt.compare(password, user.rows[0].password).then(isMatch => {
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials...' });

            jwt.sign(
                {
                    id: user.rows[0].userid,
                    name: user.rows[0].username,
                    status: user.rows[0].status
                },
                JWTSECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: {
                            id: user.rows[0].userid,
                            name: user.rows[0].username,
                            status: user.rows[0].status
                        }
                    });
                }
            )
        })
    } catch (err) {
        console.error(err.message);
    }
})

app.get('/auth/user', auth, async (req, res) => {
    const { id } = res.locals.user;
    try {
        await pool.query('SELECT username, status FROM accountstatus WHERE userid = $1', [id])
            .then(user => res.json(user.rows[0]));
    } catch (err) {
        console.error(err.message);
    }
})

//decode token
app.get('/decode', async (req, res) => {
    const token = req.header('x-auth-token');
    const decoded = jwt.verify(token, JWTSECRET);
    res.json(decoded);
})