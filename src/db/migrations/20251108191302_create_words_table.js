exports.up = function (knex) {
  return knex.schema.createTable('words', (table) => {
    table.increments('id').primary();
    table
      .integer('category_id')
      .unsigned()
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE'); // if category deleted, its words also deleted
    table.string('word').notNullable(); // e.g. Inception, Paris, Iron Man
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('words');
};
