const knex = require("../../../knexConnection");

const createRoom = async (code, adminId) => {
    try {
        const [roomId] = await knex("rooms").insert({
            code,
            admin_id: adminId,
            is_active: true
        });
        return { status: true, roomId };
    } catch (error) {
        return { status: false, message: error.message };
    }
};

const findRoomByCode = async (code) => {
    try {
        const room = await knex("rooms").where({ code }).first();
        if (!room) return { status: false, message: "Room not found" };
        return { status: true, data: room };
    } catch (error) {
        return { status: false, message: error.message };
    }
};

module.exports = { createRoom, findRoomByCode };
