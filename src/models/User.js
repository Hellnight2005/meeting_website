const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: false,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure that the email is unique
      lowercase: true, // Save emails in lowercase
      match: [/\S+@\S+\.\S+/, "Please use a valid email address."], // Email regex pattern
    },
    photo: { type: String, default: "public/icons/login_user.svg" },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    accessToken: String,
    refreshToken: String,
    password: {
      type: String, // Password is required for traditional login
      required: function () {
        // Only require password for traditional login, not Google login
        return !this.googleId;
      },
    },
    type: String,
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields automatically
  }
);

// You can define pre-save or post-save middleware if needed for password hashing or other operations
module.exports = mongoose.model("User", userSchema);
