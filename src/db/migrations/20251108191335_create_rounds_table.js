exports.up = function (knex) {
  return knex.schema.createTable('rounds', (table) => {
    table.increments('id').primary();

    // Reference to the room
    table
      .integer('room_id')
      .unsigned()
      .references('id')
      .inTable('rooms')
      .onDelete('CASCADE');

    // Reference to the chosen word
    table
      .integer('word_id')
      .unsigned()
      .references('id')
      .inTable('words')
      .onDelete('CASCADE');

    // Reference to the imposter player
    table
      .integer('imposter_id')
      .unsigned()
      .references('id')
      .inTable('players')
      .onDelete('SET NULL');

    // Round number for that room
    table.integer('round_number').unsigned();

    // Round status
    table.boolean('is_finished').defaultTo(false);

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('rounds');
};
