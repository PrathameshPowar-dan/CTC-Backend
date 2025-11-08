const crypto = require("crypto");
const { createRoom, findRoomByCode } = require("./roomHelper");
const knex = require("../../../knexConnection");
const { success } = require("../../utils/response");
const { badRequest, notFound, internal } = require("../../utils/errors");

// Create a new game room
const createRoomController = async (req, res, next) => {
    try {
        const { username } = req.body;
        if (!username) return next(badRequest("Username is required"));

        // Step 1: Insert admin player
        const [playerId] = await knex("players").insert({ username, is_admin: true });

        // Step 2: Generate room code
        const code = crypto.randomBytes(3).toString("hex").toUpperCase();

        // Step 3: Create the room
        const roomResp = await createRoom(code, playerId);
        if (!roomResp.status) return next(internal(roomResp.message));

        // Step 4: Link player to room
        await knex("players").where({ id: playerId }).update({ room_id: roomResp.roomId });

        return success(res, "Room created successfully", 201, {
            room: { id: roomResp.roomId, code },
            admin: { id: playerId, username },
        });

    } catch (error) {
        next(internal(error.message));
    }
};

// Join existing room
const joinRoomController = async (req, res, next) => {
    try {
        const { username, code } = req.body;
        if (!username || !code) return next(badRequest("Username and Room Code required"));

        const room = await findRoomByCode(code);
        if (!room.status) return next(notFound(room.message));

        // Ensure username is unique in that room
        const existing = await knex("players").where({ username, room_id: room.data.id }).first();
        if (existing) return next(badRequest("Username already taken in this room"));

        const [playerId] = await knex("players").insert({ username, room_id: room.data.id });
        return success(res, "Joined room successfully", 200, { playerId, username, roomCode: code });

    } catch (error) {
        next(internal(error.message));
    }
};

module.exports = { createRoomController, joinRoomController };
