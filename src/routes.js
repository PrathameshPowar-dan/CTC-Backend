const router = require("express").Router();
const gameRoutes = require("./controllers/game/index");
// const userRoutes = require("./user");


// router.use("/user", userRoutes)
router.use("/game", gameRoutes);

module.exports = router


