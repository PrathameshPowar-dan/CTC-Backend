const { addCategory, getCategories, existingCategoryByName } = require("./categoryHelper");
const { success } = require("../../utils/response");
const { badRequest, internal } = require("../../utils/errors");

const createCategory = async (req, res, next) => {
    try {
        const { room_id, name } = req.body;

        if (!room_id || !name) {
            return next(badRequest("room_id and name required"));
        }

        const result = await addCategory(room_id, name);

        if (!result.status) {
            // Duplicate category case
            if (result.message === "Category already exists in this room") {
                return next(badRequest(result.message));
            }

            return next(internal(result.message));
        }

        return success(res, "Category created", 201, { id: result.id });

    } catch (error) {
        next(internal(error.message));
    }
};

const listCategories = async (req, res, next) => {
    try {
        const { room_id } = req.query;
        if (!room_id) return next(badRequest("room_id required"));
        const result = await getCategories(room_id);
        if (!result.status) return next(internal(result.message));
        return success(res, "Categories fetched", 200, result.data);
    } catch (error) {
        next(internal(error.message));
    }
};

module.exports = { createCategory, listCategories };
