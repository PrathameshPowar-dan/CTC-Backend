exports.up = function (knex) {
  return knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table
      .integer('room_id')
      .unsigned()
      .references('id')
      .inTable('rooms')
      .onDelete('CASCADE'); // if room deleted, its categories also deleted
    table.string('name').notNullable(); // e.g. Movies, Places, People
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('categories');
};
