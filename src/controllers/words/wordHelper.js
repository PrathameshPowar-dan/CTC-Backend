const knex = require("../../../knexConnection");

// ----------------------------
// Validate Room Exists
// ----------------------------
const validateRoom = async (roomId) => {
    const room = await knex("rooms").where({ id: roomId }).first();
    return !!room;
};

// ----------------------------
// Validate Category Exists
// ----------------------------
const validateCategory = async (categoryId, roomId) => {
    const category = await knex("categories")
        .where({ id: categoryId, room_id: roomId })
        .first();
    return !!category;
};

// ----------------------------
// Add Word
// ----------------------------
const addWord = async (roomId, categoryId, word) => {
    try {
        // Validate room exists
        const roomExists = await validateRoom(roomId);
        if (!roomExists) {
            return { status: false, message: "Invalid room_id. Room does not exist." };
        }

        // Validate category exists inside this room
        const categoryExists = await validateCategory(categoryId, roomId);
        if (!categoryExists) {
            return { status: false, message: "Invalid category_id for this room." };
        }

        // Validate duplicate inside same category + room
        const existing = await knex("words")
            .where({ room_id: roomId, category_id: categoryId, word })
            .first();

        if (existing) {
            return {
                status: false,
                message: "Word already exists in this category for this room."
            };
        }

        // Insert word
        const [id] = await knex("words").insert({
            room_id: roomId,
            category_id: categoryId,
            word
        });

        return { status: true, id };

    } catch (error) {
        return { status: false, message: error.message };
    }
};

// ----------------------------
// Fetch Words by Category
// ----------------------------
const getWordsByCategory = async (roomId, categoryId) => {
    try {
        // Validate room
        const roomExists = await validateRoom(roomId);
        if (!roomExists) {
            return { status: false, message: "Invalid room_id. Room does not exist." };
        }

        // Validate category
        const categoryExists = await validateCategory(categoryId, roomId);
        if (!categoryExists) {
            return { status: false, message: "Invalid category_id for this room." };
        }

        // Fetch words
        const data = await knex("words")
            .where({ room_id: roomId, category_id: categoryId })
            .select();

        return { status: true, data };

    } catch (error) {
        return { status: false, message: error.message };
    }
};

module.exports = { addWord, getWordsByCategory };
