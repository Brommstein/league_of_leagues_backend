const AuthService = {
    //await pool.query('SELECT username, status FROM accountstatus WHERE userid = $1', [id])
    getAuthUser(knex, id) {
        return knex.select('username').from(accountstatus).where('userid', id);
    },
    //await pool.query(`SELECT * FROM accountstatus WHERE username=$1`, [username]);
    login(knex, username) {
        return knex.select('*').from('accountstatus').where('username', username);
    }
};

module.exports = AuthService;