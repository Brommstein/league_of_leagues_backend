require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const UsersRouter = require('./users/users-router');
const TeamsRouter = require('./teams/teams-router');
const AccountstatusRouter = require('./accountstatus/accountstatus-router');
const AuthRouter = require('./auth/auth-router');

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/users', UsersRouter);
app.use('/teams', TeamsRouter);
app.use('/accountstatus', AccountstatusRouter);
app.use('/auth', AuthRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error', message: error.message, error } };
    } else {
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});

module.exports = app;