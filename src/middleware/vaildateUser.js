const User = require("@/models/User");

const checkAuthType = async (req, res, next) => {
  const userId = req.body.userId;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasTokens = user.accessToken && user.refreshToken;
    const userType = hasTokens ? "google" : "guest";

    // Update only if the type has changed (optional optimization)
    if (user.type !== userType) {
      await User.findByIdAndUpdate(userId, { type: userType });
    }

    next();
  } catch (error) {
    console.error("checkAuthType error:", error.message);
    res.status(500).json({ message: "Server error while checking auth type" });
  }
};

module.exports = checkAuthType;
