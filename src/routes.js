const router = require("express").Router();
const roomRoutes = require("./controllers/room/index");
const categoryRoutes = require("./controllers/category/index");
// const userRoutes = require("./user");


// router.use("/user", userRoutes)
router.use("/room", roomRoutes);
router.use("/category", categoryRoutes);

module.exports = router


