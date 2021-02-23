const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./users-service');
const userRouter = express.Router();
const jsonBodyParser = express.json();

const serializeUser = users => ({
    userid: users.userid,
    leaguename: xss(users.leaguename),
    preferedrole: users.preferedrole,
    secondaryrole: users.secondaryrole,
    sunday: users.sunday,
    monday: users.monday,
    tuesday: users.tuesday,
    wednesday: users.wednesday,
    thursday: users.thursday,
    friday: users.friday,
    saturday: users.saturday,
    team: users.team
});

userRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(serializeUser));
            })
            .catch(next);
    })
    .post(jsonBodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const { leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday, team } = req.body;
        const newUser = { leaguename, preferedrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday, team };

        for (const [key, value] of Object.entries(newUser))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });

        if (secondaryrole) {
            newUser.secondaryrole = secondaryrole;
        }

        UsersService.insertUser(knexInstance, newUser)
            .then(users => {
                console.table(users);
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${users.id}`))
                    .json(serializeUser(users));
            })
            .catch(next);
    });
/*
app.get('/users', async (req, res) => {
    try {

        const allUsers = await pool.query('SELECT * FROM users');
        res.json(allUsers.rows);

    } catch (err) {
        console.error(err.message);
    }
})
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
*/

userRouter
    .route('/:id')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: 'User does not exist' }
                    });
                }
                res.user = user;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeUser(res.user));
    })
    .delete((req, res, next) => {
        UsersService.deleteUser(req.app.get('db'), req.params.id)
            .then((numRowsAffected) => {
                return res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday } = req.body;
        const newNoteFields = { leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday };

        const numOfValues = Object.values(newNoteFields).filter(Boolean).length;
        if (numOfValues === 0) {
            return res
                .status(400)
                .json({
                    error: {
                        message:
                            'Your response must include one of the following fields: leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday',
                    },
                });
        }

        UsersService.updateUser(
            req.app.get('db'),
            req.params.id,
            newNoteFields
        )
            .then((numRowsAffected) => {
                return res.status(204).end();
            })
            .catch(next);
    });
/*
 app.get('/users/:id', async (req, res) => {
try {
    const { id } = req.params;
    const user = await pool.query('SELECT * FROM users WHERE userid = $1', [id]);
    res.json(user.rows[0]);
} catch (err) {
    console.error(err.message);
}
})
app.delete('/users/:id', async (req, res) => {
try {
    const { id } = req.params;
    const deleteUser = await pool.query('DELETE FROM users WHERE userid = $1', [id]);
    res.json('User was deleted!');
} catch (err) {
    console.error(err.message);
}
})
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
*/

userRouter
    .route('/teamupdate/:id')
    .all((req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: 'User does not exist' }
                    });
                }
                res.user = user;
                next();
            })
            .catch(next);
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { team } = req.body;
        const newteamFields = { team };

        const numOfValues = Object.values(newteamFields).filter(Boolean).length;
        if (numOfValues === 0) {
            return res
                .status(400)
                .json({
                    error: {
                        message:
                            'Your response must include one of the following fields: leaguename, preferedrole, secondaryrole, sunday, monday, tuesday, wednesday, thursday, friday, saturday',
                    },
                });
        }
        UsersService.updateUserTeam(
            req.app.get('db'),
            req.params.id,
            newteamFields
        )
            .then((numRowsAffected) => {
                return res.status(204).end();
            })
            .catch(next);
    });
/*
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
*/

module.exports = userRouter;