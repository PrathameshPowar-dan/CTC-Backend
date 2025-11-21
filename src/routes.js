const router = require("express").Router();
const roomRoutes = require("./controllers/room/index");
const categoryRoutes = require("./controllers/category/index");
const wordsRoutes = require("./controllers/words/index");
// const userRoutes = require("./user");


// router.use("/user", userRoutes)
router.use("/room", roomRoutes);
router.use("/category", categoryRoutes);
router.use("/words", wordsRoutes);

module.exports = router


