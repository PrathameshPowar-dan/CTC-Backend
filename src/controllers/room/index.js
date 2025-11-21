const express = require("express");
const { createRoomController, joinRoomController } = require("./roomController");
const router = express.Router();

router.post("/create-room", createRoomController);
router.post("/join-room", joinRoomController);

module.exports = router;
