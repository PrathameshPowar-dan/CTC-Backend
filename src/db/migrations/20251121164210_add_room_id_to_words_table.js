exports.up = function (knex) {
    return knex.schema.table("words", (table) => {
        table
            .integer("room_id")
            .unsigned()
            .references("id")
            .inTable("rooms")
            .onDelete("CASCADE")
            .after("category_id");
    });
};

exports.down = function (knex) {
    return knex.schema.table("words", (table) => {
        table.dropForeign("room_id");
        table.dropColumn("room_id");
    });
};
