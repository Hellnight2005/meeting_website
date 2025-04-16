// routes/auth.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  googleLogin,
  googleCallback,
  handleLogin,
  handleSignup,
} = require("@/controllers/authController");

// Google Login Route
router.get("/google", googleLogin);

// Google Callback Route
router.get("/google/callback", googleCallback);

// Traditional Email/Password Login Route
router.get("/login", (req, res) => {
  res.render("login"); // Render login page
});

// Handle Traditional Email/Password Login
router.post("/login", handleLogin);

// Handle Traditional Signup for first-time users (email/password)
router.post("/signup", handleSignup);

module.exports = router;
