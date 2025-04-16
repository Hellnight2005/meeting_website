// router.js
const express = require("express");
const router = express.Router();
const { checkAuthType } = require("../middleware/vaildateUser");
// Import the controller
const { getUserById } = require("../controllers/userController");

// Route to get user by ID
router.get("/:id", checkAuthType, getUserById);

module.exports = router;
