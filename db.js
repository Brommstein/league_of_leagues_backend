const Pool = require('pg').Pool;

const pool = new Pool({
    user: "inhjayoelppvqd",
    password: "9561d42deee587ac13a0973ad2a01b2ba2d6a139cb4ce45ff49fd857de1ca2d4",
    host: "ec2-3-95-85-91.compute-1.amazonaws.com",
    port: 5432,
    database: "dbr3eu1rmch5gk",
    URI: "postgres://inhjayoelppvqd:9561d42deee587ac13a0973ad2a01b2ba2d6a139cb4ce45ff49fd857de1ca2d4@ec2-3-95-85-91.compute-1.amazonaws.com:5432/dbr3eu1rmch5gk",
    Heroku_CLI: "heroku pg:psql postgresql-aerodynamic-59043 --app league-of-leagues-backend"
});

module.exports = pool;