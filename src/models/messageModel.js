const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to your User model
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    selectDay: {
      type: String,
      required: true,
    },
    selectTime: {
      type: String,
      required: true,
    },
    slot: {
      type: Number,
      required: true,
      default: 1,
    },
    meetingLink: {
      type: String,
    },
    eventId: {
      type: String, // Google Calendar event ID
    },
    type: {
      type: String,
      enum: ["upcoming", "line up"],
      default: "line up",
    },
    user_role: {
      type: String,
      enum: ["user", "Admin"],
      required: true,
    },
    startDateTime: { type: String },
    endDateTime: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
