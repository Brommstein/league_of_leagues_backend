const path = require('path');
const express = require('express');
const xss = require('xss');
const AccountstatusService = require('./accountstatus-service');
const accountstatusRouter = express.Router();
const jsonBodyParser = express.json();
const { JWTSECRET } = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const serializeAccountstatus = accountstatus => ({
    userid: accountstatus.userid,
    username: xss(accountstatus.username),
    _password: xss(accountstatus.password),
    _status: xss(accountstatus.status)
});

accountstatusRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        AccountstatusService.getAllAccountstatus(knexInstance)
            .then(accountstatus => {
                res.json(accountstatus.map(serializeAccountstatus));
            })
            .catch(next);
    })
    .post(jsonBodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const { userid, username, _password, _status } = req.body;
        const newAccountstatus = { userid, username, _password, _status };

        console.log('Before hashing of password');
        console.log('req.body', req.body);
        console.table('newAccountstatus', newAccountstatus);

        for (const [key, value] of Object.entries(newAccountstatus))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}'` }
                });

        bcrypt.hash(_password, saltRounds, function (err, hash) {
            if (err) console.error(err.message);
            newAccountstatus[_password] = hash;
            console.log('After hashing the password');
            console.table(newAccountstatus);
            AccountstatusService.insertAccountstatus(knexInstance, newAccountstatus)
                .then(accountstatus => {
                    console.log('newAccountstatus inserted into db');
                    console.table(accountstatus);
                    jwt.sign(
                        {
                            id: userid,
                            name: username,
                            status: _status
                        },
                        JWTSECRET,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            console.log('Token created');
                            console.log({ token });
                            res.status(201)
                                .location(path.posix.join(req.originalUrl, `/${accountstatus.userid}`))
                                .json({
                                    token: token,
                                    user: {
                                        id: userid,
                                        username: username,
                                        status: _status
                                    }
                                })
                        })
                }).catch(next);
        })
    });
/*
app.get('/accountstatus', async (req, res) => {
try {
    const allaccountstatus = await pool.query('SELECT * FROM accountstatus');
    res.json(allaccountstatus.rows);
} catch (err) {
    console.error(err.message);
}
})
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
*/
accountstatusRouter
    .route('/:id')
    .all((req, res, next) => {
        AccountstatusService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(accountstatus => {
                if (!accountstatus) {
                    return res.status(404).json({
                        error: { message: 'Account status does not exist' }
                    });
                }
                res.accountstatus = accountstatus;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializeAccountstatus(res.accountstatus));
    })
    .delete((req, res, next) => {
        AccountstatusService.deleteAccountstatus(req.app.get('db'), req.params.id)
            .then((numRowsAffected) => {
                return res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { status } = req.body;
        const newaccountstatusFields = { status };

        const numOfValues = Object.values(newaccountstatusFields).filter(Boolean).length;
        if (numOfValues === 0) {
            return res
                .status(400)
                .json({
                    error: {
                        message:
                            'Your response must include a status.',
                    },
                });
        }

        AccountstatusService.updateAccountstatus(
            req.app.get('db'),
            req.params.id,
            newaccountstatusFields
        )
            .then((numRowsAffected) => {
                return res.status(204).end();
            })
            .catch(next);
    });
/*
app.get('/accountstatus/:id', async (req, res) => {
try {
    const { id } = req.params;
    const status = await pool.query('SELECT * FROM accountstatus WHERE userid = $1', [id]);
    res.json(status.rows[0]);
} catch (err) {
    console.error(err.message);
}
})
app.delete('/accountstatus/:id', async (req, res) => {
try {
    const { id } = req.params;
    const deleteaccountstatus = await pool.query('DELETE FROM accountstatus WHERE userid = $1', [id]);
    res.json('User status was deleted!');
} catch (err) {
    console.error(err.message);
}
})
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
*/

module.exports = accountstatusRouter;