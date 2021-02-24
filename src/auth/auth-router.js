const express = require('express');
const AuthService = require('./auth-service');
const authRouter = express.Router();
const jsonBodyParser = express.json();
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWTSECRET } = require('../config');

authRouter
    .route('/')
    /*
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
    */
    .post(jsonBodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const { username, password } = req.body;
        const login = { username, password };

        for (const [key, value] of Object.entries(login))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });

        AuthService.login(knexInstance, login.username)
            .then(login => {
                bcrypt.compare(password, login[0].password, (err, isMatch) => {
                    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials...' });
                    jwt.sign(
                        {
                            id: login[0].userid,
                            name: login[0].username,
                            status: login[0].status
                        },
                        JWTSECRET,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: login[0].userid,
                                    name: login[0].username,
                                    status: login[0].status
                                }
                            });
                        }
                    )
                })
            }).catch(next);
    });

authRouter
    .route('/user')
    /*
    app.get('/auth/user', auth, async (req, res) => {
    const { id } = res.locals.user;
    try {
        await pool.query('SELECT username, status FROM accountstatus WHERE userid = $1', [id])
            .then(user => res.json(user.rows[0]));
    } catch (err) {
        console.error(err.message);
    }
})
    */
    .get(auth, (req, res, next) => {
        const { id } = res.locals.user;
        const knexInstance = req.app.get('db');
        //await pool.query('SELECT username, status FROM accountstatus WHERE userid = $1', [id])
        AuthService.getAuthUser(knexInstance, id)
            .then(auth => {
                res.json(auth.rows[0]);
            })
            .catch(next);
    });

authRouter
    .route('/decode')
    /*
    app.get('/decode', async (req, res) => {
const token = req.header('x-auth-token');
const decoded = jwt.verify(token, JWTSECRET);
res.json(decoded);
})
    */
    .get((req, res) => {
        const token = req.header('x-auth-token');
        const decoded = jwt.verify(token, JWTSECRET);
        res.json(decoded);
    })






module.exports = authRouter;