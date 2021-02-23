const AsscountStatusService = {
    //Get all accountstatus
    getAllAccountstatus(knex) {
        return knex.select('*').from('accountstatus');
    },
    //Add an accountstatus
    insertAccountstatus(knex, accountstatus) {
        return knex
            .insert(accountstatus)
            .into('accountstatus')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    //Get an accountstatus
    getById(knex, id) {
        return knex
            .from('accountstatus')
            .select('*')
            .where('id', id)
            .first();
    },
    //Delete an accountstatus
    deleteAccountstatus(knex, id) {
        return knex
            .from('accountstatus')
            .where({ id })
            .delete();
    },
    //Update an accountstatus
    updateAccountstatus(knex, id, newaccountstatusFields) {
        return knex
            .from('accountstatus')
            .where({ id })
            .update(newaccountstatusFields);
    }
};

module.exports = AsscountStatusService;