const Pool = require('pg').Pool;

const pool = new Pool({
    access: 'heroku pg:psql postgresql-aerodynamic-59043 --app league-of-leagues-backend'
});

pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    pool.end();
});

module.exports = pool;