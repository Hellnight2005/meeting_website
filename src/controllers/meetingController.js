const { google } = require("googleapis");
const prisma = require("@/lib/prisma");
const logger = require("@/lib/logger");
const {
  createCalendarEvent,
  deleteCalendarEvent,
} = require("@/config/googleCalendar");

const validTypes = ["upcoming", "line up"];
const validRoles = ["user", "Admin"];

const handleErrorResponse = (res, statusCode, message) => {
  logger.error(message);
  return res.status(statusCode).json({ success: false, message });
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
  if (
    !user_name ||
    !title ||
    !selectDay ||
    !selectTime ||
    !slot ||
    !user_role
  ) {
    return "All required fields must be filled.";
  }

  if (typeof slot !== "number" || slot <= 0) {
    return "Slot must be a positive number.";
  }

  if (type && !validTypes.includes(type)) {
    return `Invalid meeting type. Allowed: ${validTypes.join(", ")}`;
  }

  if (!validRoles.includes(user_role)) {
    return `Invalid user role. Allowed: ${validRoles.join(", ")}`;
  }

  return null;
};

// ✅ Create a new meeting
const createMeeting = async (req, res) => {
  try {
    const data = req.body;

    const validationError = validateMeetingData(data);
    if (validationError) return handleErrorResponse(res, 400, validationError);

    if (!data.userId)
      return handleErrorResponse(res, 400, "userId is required.");

    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) return handleErrorResponse(res, 404, "User not found.");

    const meeting = await prisma.meeting.create({
      data: {
        ...data,
        user_name: user.displayName,
        user_role: user.role || "user",
      },
    });

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

// ✅ Reschedule meeting
const rescheduleMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectDay, selectTime, slot, type } = req.body;

    if (!selectDay || !selectTime) {
      return handleErrorResponse(res, 400, "New date and time are required");
    }

    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) return handleErrorResponse(res, 404, "Meeting not found");

    const user = await prisma.user.findUnique({
      where: { id: meeting.userId },
    });
    if (!user) return handleErrorResponse(res, 404, "User not found");

    if (meeting.eventId) {
      const deleted = await deleteCalendarEvent(
        meeting.eventId,
        user.refreshToken
      );
      if (!deleted.success) {
        return handleErrorResponse(res, 500, "Failed to delete calendar event");
      }
    }

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        selectDay,
        selectTime,
        slot,
        type: type || "line_up",
        startDateTime: null,
        endDateTime: null,
        meetingLink: null,
        eventId: null,
      },
    });

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

// ✅ Approve a meeting
const approveMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!meeting) return handleErrorResponse(res, 404, "Meeting not found.");

    const user = await prisma.user.findUnique({
      where: { id: meeting.userId },
    });
    const admin = await prisma.user.findFirst({ where: { role: "admin" } });

    if (!user || !admin)
      return handleErrorResponse(res, 404, "User/Admin not found");

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

    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        type: "upcoming",
        meetingLink: calendarData.user.meetingLink,
        eventId: calendarData.user.eventId,
      },
    });

    res.json({
      message: "Meeting approved and calendar event created.",
      meeting: updatedMeeting,
      calendarData,
    });
  } catch (error) {
    logger.error(`Error in approveMeeting: ${error.message}`);
    return handleErrorResponse(res, 500, "Internal server error.");
  }
};

// ✅ Delete a meeting
const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) return handleErrorResponse(res, 404, "Meeting not found");

    const user = await prisma.user.findUnique({
      where: { id: meeting.userId },
    });
    if (!user) return handleErrorResponse(res, 404, "User not found");

    if (meeting.eventId) {
      const deleted = await deleteCalendarEvent(
        meeting.eventId,
        user.refreshToken
      );
      if (!deleted.success) {
        return handleErrorResponse(res, 500, "Failed to delete calendar event");
      }
    }

    await prisma.meeting.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    logger.error(`Error in deleteMeeting: ${error.message}`);
    return handleErrorResponse(res, 500, "Failed to delete meeting");
  }
};

// ✅ Get grouped meetings by selectDay
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      where: {
        eventId: { not: null },
      },
    });

    if (!meetings.length) {
      return res.status(200).json({
        message: "No meetings found with eventId",
        noData: true,
        approvedMeetings: [],
      });
    }

    const grouped = {};

    meetings.forEach((meeting) => {
      const day = meeting.selectDay;
      const time = meeting.selectTime;

      if (!grouped[day]) grouped[day] = { day, times: [] };

      grouped[day].times.push({
        time,
        meetingId: meeting.id,
      });
    });

    res.status(200).json({ approvedMeetings: Object.values(grouped) });
  } catch (err) {
    logger.error(`Error in getAllMeetings: ${err.message}`);
    res.status(500).json({ message: "Server error while fetching meetings" });
  }
};

// ✅ Raw list of meetings
const meetings = async (req, res) => {
  try {
    const allMeetings = await prisma.meeting.findMany();
    if (!allMeetings.length) {
      return res.status(404).json({ message: "No meetings found" });
    }
    res.status(200).json(allMeetings);
  } catch (err) {
    logger.error(`Error in meetings: ${err.message}`);
    res.status(500).json({ message: "Server error while fetching meetings" });
  }
};

module.exports = {
  createMeeting,
  rescheduleMeeting,
  approveMeeting,
  deleteMeeting,
  getAllMeetings,
  meetings,
};
