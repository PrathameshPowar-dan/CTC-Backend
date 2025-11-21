const knex = require("../../../knexConnection");

const addCategory = async (roomId, name) => {
    try {
        // Check if category already exists in this room
        const existing = await knex("categories")
            .where({ room_id: roomId, name })
            .first();

        if (existing) {
            return { status: false, message: "Category already exists in this room" };
        }

        // Insert new category
        const [id] = await knex("categories").insert({
            room_id: roomId,
            name
        });

        return { status: true, id };
    } catch (error) {
        return { status: false, message: error.message };
    }
};
const getCategories = async (roomId) => {
    try {
        const data = await knex("categories").where({ room_id: roomId });
        return { status: true, data };
    } catch (error) {
        return { status: false, message: error.message };
    }
};


module.exports = { addCategory, getCategories };
