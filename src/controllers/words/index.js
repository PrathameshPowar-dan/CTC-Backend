const express = require("express");
const { createWord, listWords } = require("./wordController");
const router = express.Router();

router.post("/add-word", createWord);
router.get("/words", listWords);

module.exports = router;