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
            .where('userid', id)
            .first();
    },
    //Delete an accountstatus
    deleteAccountstatus(knex, id) {
        return knex
            .from('accountstatus')
            .where('userid', id)
            .delete();
    },
    //Update an accountstatus
    updateAccountstatus(knex, id, newaccountstatusFields) {
        return knex
            .from('accountstatus')
            .where('userid', id)
            .where('status', 'User').orWhere('status', 'Captain')
            .update(newaccountstatusFields);
    }
};

module.exports = AsscountStatusService;