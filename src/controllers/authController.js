// controllers/authController.js
const User = require("../models/User"); // Assuming User model is used for traditional authentication
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Google Login Route Handler
const googleLogin = passport.authenticate("google", {
  scope: [
    "profile",
    "email",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ],
  accessType: "offline",
  prompt: "consent",
});

// Google Callback Route Handler
const googleCallback = (req, res) => {
  passport.authenticate("google", { failureRedirect: "/login", session: true })(
    req,
    res,
    () => {
      // Successful login via Google
      res.redirect("http://localhost:3000"); // Redirect to dashboard or wherever you need
    }
  );
};

// Handle Traditional Email/Password Login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token for user
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Send JWT token to frontend
    res.json({ token, userId: user._id }); // Return JWT token to frontend
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Handle Signup for First-Time Users (Traditional email/password)
const handleSignup = async (req, res) => {
  const { email, password, displayName } = req.body;

  // Basic validation
  if (!email || !password || !displayName) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName,
      role: "user", // Default to regular user
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a JWT token for the user after signup
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET_KEY, // Secret key from .env
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send the token as a response to the frontend
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};
module.exports = {
  googleLogin,
  googleCallback,
  handleLogin,
  handleSignup,
};
