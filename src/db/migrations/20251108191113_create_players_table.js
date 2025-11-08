exports.up = function (knex) {
    return knex.schema.createTable('players', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.integer('room_id').unsigned().nullable(); // linked later
        table.boolean('is_admin').defaultTo(false);
        table.boolean('is_imposter').defaultTo(false);
        table.timestamps(true, true);
        table.unique(['username', 'room_id']); // username must be unique per room
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('players');
};
