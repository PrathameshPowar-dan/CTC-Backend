const express = require("express");
const { createCategory, listCategories } = require("./categoryController");
const router = express.Router();

router.post("/add-category", createCategory);
router.get("/categories", listCategories);

module.exports = router;