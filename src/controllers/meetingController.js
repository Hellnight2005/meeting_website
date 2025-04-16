const { google } = require("googleapis");
const Meeting = require("../models/messageModel");
const User = require("../models/User");
const logger = require("../utils/logger"); // Use a logging utility for structured logs
const {
  createCalendarEvent,
  refreshAccessToken,
  deleteCalendarEvent,
} = require("../config/googleCalendar");

// Allowed values for type and user_role fields
const validTypes = ["upcoming", "line up"];
const validRoles = ["user", "Admin"];

/**
 * Utility function to handle error responses
 */
const handleErrorResponse = (res, statusCode, message) => {
  logger.error(message); // Log error message for production visibility
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
const validateMeetingData = ({
  user_name,
  title,
  selectDay,
  selectTime,
  slot,
  user_role,
  type,
}) => {
  // Basic required fields check
  if (
    !user_name ||
    !title ||
    !selectDay ||
    !selectTime ||
    !slot ||
    !user_role
  ) {
    return "All required fields (user_name, title, selectDay, selectTime, slot, user_role) must be filled.";
  }

  // Slot must be a positive number
  if (typeof slot !== "number" || slot <= 0) {
    return "Slot must be a positive number.";
  }

  // Validate meeting type if provided
  if (type && !validTypes.includes(type)) {
    return `Invalid meeting type. Allowed: ${validTypes.join(", ")}.`;
  }

  // Validate role
  if (!validRoles.includes(user_role)) {
    return `Invalid user role. Allowed: ${validRoles.join(", ")}.`;
  }

  return null; // ✅ All good
};

/**
 * ✅ Create a new meeting
 */
const createMeeting = async (req, res) => {
  try {
    const data = req.body;

    // Validate input
    const validationError = validateMeetingData(data);
    if (validationError) {
      return handleErrorResponse(res, 400, validationError);
    }

    // Ensure userId is provided manually (no auth middleware)
    if (!data.userId) {
      return handleErrorResponse(res, 400, "userId is required.");
    }

    // Fetch user from DB to get name and role
    const user = await User.findById(data.userId);
    if (!user) {
      return handleErrorResponse(res, 404, "User not found.");
    }

    // Attach user info manually
    data.user_name = user.displayName;
    data.user_role = user.role || "user"; // Default to user role if not specified

    // Save the meeting to DB
    const meeting = await Meeting.create(data);

    res.status(201).json({
      success: true,
      message: "Meeting created successfully.",
      data: meeting,
    });
  } catch (error) {
    logger.error(`Error in createMeeting: ${error.message}`);
    return handleErrorResponse(res, 500, "Failed to create meeting.");
  }
};

/**
 * ✅ Reschedule an existing meeting by ID
 */
const rescheduleMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectDay, selectTime, slot, type } = req.body;

    if (!selectDay || !selectTime) {
      return handleErrorResponse(res, 400, "New date, time,  are required");
    }

    // Check if meeting exists
    const existingMeeting = await Meeting.findById(id);
    if (!existingMeeting) {
      return handleErrorResponse(res, 404, "Meeting not found");
    }

    // Retrieve the user based on userId from the meeting document
    const user = await User.findById(existingMeeting.userId);
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }

    // If the meeting has an eventId, delete the existing Google Calendar event
    if (existingMeeting.eventId) {
      const deleteEventResponse = await deleteCalendarEvent(
        existingMeeting.eventId,
        user.refreshToken
      );

      if (!deleteEventResponse.success) {
        return handleErrorResponse(
          res,
          500,
          "Failed to delete the calendar event"
        );
      }
    }

    // Update meeting type to "line up"
    const updatedType =
      existingMeeting.type === "upcoming" ? "line up" : type || "line up";

    // Update meeting in the database, setting startDateTime and endDateTime to null
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      {
        selectDay,
        selectTime,
        slot,
        type: updatedType,
        startDateTime: null,
        endDateTime: null,
        meetingLink: null,
        eventId: null,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Meeting rescheduled successfully",
      data: updatedMeeting,
    });
  } catch (error) {
    logger.error(`Error in rescheduleMeeting: ${error.message}`);
    return handleErrorResponse(res, 500, "Failed to reschedule meeting");
  }
};

/**
 * ✅ Approve a meeting by changing its type to "upcoming"
 */
const approveMeeting = async (req, res) => {
  try {
    const meetingId = req.params.id;

    const meeting = await Meeting.findById(meetingId).populate("userId");
    if (!meeting) return handleErrorResponse(res, 404, "Meeting not found.");

    const user = meeting.userId;
    const admin = await User.findOne({ role: "admin" });
    if (!admin) return handleErrorResponse(res, 404, "Admin not found.");

    const startDate = new Date(meeting.startDateTime);
    const endDate = new Date(meeting.endDateTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return handleErrorResponse(
        res,
        400,
        "Invalid date format in meeting data."
      );
    }

    const calendarData = await createCalendarEvent({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      adminAccessToken: admin.accessToken,
      adminRefreshToken: admin.refreshToken,
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
      title: meeting.title,
      description: "Meeting approved",
      location: "Virtual",
      attendees: [{ email: user.email }, { email: admin.email }],
    });

    meeting.status = "approved";
    meeting.type = "upcoming";
    meeting.meetingLink = calendarData.user.meetingLink;
    meeting.eventId = calendarData.user.eventId;

    await meeting.save();

    res.json({
      message: "Meeting approved and calendar event created.",
      meeting,
      calendarData,
    });
  } catch (error) {
    logger.error(`Error in approveMeeting: ${error.message}`);
    return handleErrorResponse(res, 500, "Internal server error.");
  }
};

/**
 * ✅ Delete a meeting by ID
 */
const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return handleErrorResponse(res, 404, "Meeting not found");
    }

    const user = await User.findById(meeting.userId);
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }

    if (meeting.eventId) {
      const deleteEventResponse = await deleteCalendarEvent(
        meeting.eventId,
        user.refreshToken
      );

      if (!deleteEventResponse.success) {
        return handleErrorResponse(
          res,
          500,
          "Failed to delete the calendar event"
        );
      }
    }

    const deletedMeeting = await Meeting.findByIdAndDelete(id);
    if (!deletedMeeting) {
      return handleErrorResponse(res, 404, "Meeting deletion failed");
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
      data: deletedMeeting,
    });
  } catch (error) {
    logger.error(`Error in deleteMeeting: ${error.message}`);
    return handleErrorResponse(res, 500, "Failed to delete meeting");
  }
};

/**
 * ✅ Get meetings for a specific month and year based on "selectDay"
 */
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      eventId: { $exists: true, $ne: null },
    });

    if (!meetings || meetings.length === 0) {
      return res.status(200).json({
        message: "No meetings found with eventId",
        noData: true,
        approvedMeetings: [], // Return an empty array as the result
      });
    }

    const grouped = {};

    meetings.forEach((meeting) => {
      const day = meeting.selectDay;
      const time = meeting.selectTime;

      if (!grouped[day]) {
        grouped[day] = {
          day,
          times: [],
        };
      }

      grouped[day].times.push({
        time,
        meetingId: meeting._id.toString(),
      });
    });

    const approvedMeetings = Object.values(grouped); // turn grouped object into array

    res.status(200).json({ approvedMeetings });
  } catch (err) {
    console.error("Error fetching meetings:", err);
    res.status(500).json({ message: "Server error while fetching meetings" });
  }
};

const meetings = async (req, res) => {
  try {
    const meetings = await Meeting.find(); // Fetch all meetings from the database

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ message: "No meetings found" });
    }

    res.status(200).json(meetings); // Return the list of meetings
  } catch (err) {
    console.error("Error fetching meetings:", err);
    res.status(500).json({ message: "Server error while fetching meetings" });
  }
};

// Export all functions
module.exports = {
  createMeeting,
  rescheduleMeeting,
  approveMeeting,
  deleteMeeting,
  getAllMeetings,
  meetings,
};
