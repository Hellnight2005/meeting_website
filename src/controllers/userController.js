// controllers/userController.js
const User = require("../models/User"); // Adjust the path to your User model

// Controller to get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params; // Extract user ID from the route parameters

  try {
    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data as response
    res.json(user);
  } catch (error) {
    // Handle errors (e.g., invalid ObjectId format)
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getUserById,
};
