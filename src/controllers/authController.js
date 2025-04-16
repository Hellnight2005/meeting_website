const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Google Login
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

// Google Callback
const googleCallback = (req, res) => {
  passport.authenticate("google", { failureRedirect: "/login", session: true })(
    req,
    res,
    () => {
      res.redirect("http://localhost:3000"); // Redirect after successful login
    }
  );
};

// Traditional Login
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user.id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Signup
const handleSignup = async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        displayName,
        role: "user",
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: newUser.id });
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
