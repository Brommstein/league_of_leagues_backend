const UsersService = {
    //Get all users
    getAllUsers(knex) {
        return knex.select('*').from('users');
    },

    //Add a user
    insertUser(knex, newuser) {
        return knex
            .insert(newuser)
            .into('users')
            .returning('*')
            .then(rows => {
                console.table(rows);
                return rows[0];
            });
    },

    //Get a user
    getById(knex, id) {
        return knex
            .from('users')
            .select('*')
            .where('id', id)
            .first();
    },

    //Delete a user
    deleteUser(knex, id) {
        return knex
            .from('users')
            .where('id', id)
            .delete();
    },

    //Update a user
    updateUser(knex, id, newuserFields) {
        return knex
            .from('users')
            .where('id', id)
            .update(newuserFields);
    },

    //Update a user's team
    updateUserTeam(knex, id, newteamFields) {
        return knex
            .from('users')
            .where('id', id)
            .update(newteamFields);
    }
};

module.exports = UsersService;