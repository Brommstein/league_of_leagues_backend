const Pool = require('pg').Pool;

const pool = new Pool({
    host: 'ec2-3-95-85-91.compute-1.amazonaws.com',
    database: 'dbr3eu1rmch5gk',
    user: 'inhjayoelppvqd',
    port: '5432',
    password: '9561d42deee587ac13a0973ad2a01b2ba2d6a139cb4ce45ff49fd857de1ca2d4'
});

pool.query('SELECT * FROM teams', (err, res) => {
    console.log(err, res);
    pool.end();
});

module.exports = pool;