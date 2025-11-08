const express = require("express");
const { addUser, updateUser, updatePassword, toggleActiveStatus, getAllUsers, loginUser, getAccessToken } = require("./userController");
const router = express.Router();

router.post('/register', addUser);
router.put('/update', updateUser);
router.get('/active-status/:id', toggleActiveStatus);
router.put('/update-password', updatePassword);
router.get('/get-users', getAllUsers)

// External Routes
router.post("/login", loginUser)



module.exports = router