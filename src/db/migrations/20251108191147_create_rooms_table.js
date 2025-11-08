exports.up = function (knex) {
  return knex.schema.createTable('rooms', (table) => {
    table.increments('id').primary();
    table.string('code').unique().notNullable(); // unique room code like ABC123
    table
      .integer('admin_id')
      .unsigned()
      .references('id')
      .inTable('players')
      .onDelete('CASCADE'); // if admin deleted, room is deleted
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('rooms');
};
