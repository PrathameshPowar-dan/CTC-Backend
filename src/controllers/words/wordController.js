const { addWord, getWordsByCategory } = require("./wordHelper");
const { success } = require("../../utils/response");
const { badRequest, internal } = require("../../utils/errors");

const createWord = async (req, res, next) => {
    try {
        const { room_id, category_id, word } = req.body;

        if (!room_id || !category_id || !word) {
            return next(badRequest("room_id, category_id and word are required"));
        }

        const result = await addWord(room_id, category_id, word);

        if (!result.status) {
            return next(badRequest(result.message));
        }

        return success(res, "Word added successfully", 201, { id: result.id });

    } catch (error) {
        next(internal(error.message));
    }
};


const listWords = async (req, res, next) => {
    try {
        const { category_id } = req.query;
        if (!category_id) return next(badRequest("category_id is required"));

        const result = await getWordsByCategory(category_id);
        if (!result.status) return next(internal(result.message));

        return success(res, "Words fetched", 200, result.data);

    } catch (error) {
        next(internal(error.message));
    }
};

module.exports = { createWord, listWords };
