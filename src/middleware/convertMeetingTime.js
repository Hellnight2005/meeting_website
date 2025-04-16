const moment = require("moment");
const Meeting = require("@/models/messageModel");
const logger = require("@/utils/logger"); // Assuming logger setup with winston or another logging tool

/**
 * Middleware to convert meetin./mg time to valid start and end datetime.
 * It ensures correct date format and validates meeting slot duration.
 */
const convertMeetingTime = async (req, res, next) => {
  try {
    const meetingId = req.params.id;

    // Validate meetingId presence
    if (!meetingId) {
      return res.status(400).json({ message: "Meeting ID is required." });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    const rawDay = String(meeting.selectDay || "").trim();
    const rawTime = String(meeting.selectTime || "").trim();
    const slot = parseInt(meeting.slot, 10);

    logger.debug("RAW MEETING FIELDS =>", { rawDay, rawTime, slot });

    // Validate meeting slot duration
    if (isNaN(slot) || slot <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid or missing meeting slot duration." });
    }

    // Ensure correct format for selectDay
    const parts = rawDay.split(",");
    if (parts.length < 3) {
      return res.status(400).json({
        message: "Invalid selectDay format. Expected format: Month, Day, Year",
        debug: { rawDay },
      });
    }

    const datePart = `${parts[1].trim()}, ${parts[2].trim()}`;
    const fullDateTime = `${datePart} ${rawTime}`;

    // Validate the meeting date/time format
    const m = moment(fullDateTime, "MMMM D, YYYY h:mm A", true);
    if (!m.isValid()) {
      return res.status(400).json({
        message: "Invalid meeting date/time format.",
        debug: {
          datePart,
          rawTime,
          fullDateTime,
          formatUsed: "MMMM D, YYYY h:mm A",
        },
      });
    }

    // Calculate start and end times for the meeting
    const start = m.toDate();
    const end = new Date(start.getTime() + slot * 60 * 1000);

    // Attach meeting times to the request for further use in other middlewares or controllers
    req.meetingTime = {
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
    };

    req.meeting = meeting;

    // Save start and end times to meeting model in DB
    meeting.startDateTime = start.toISOString();
    meeting.endDateTime = end.toISOString();
    await meeting.save();

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    logger.error("Error in convertMeetingTime middleware: ", error);

    // Return a 500 server error with detailed message
    return res.status(500).json({
      message: "Error processing meeting time. Please try again later.",
      error: error.message, // Provide error details in development, remove in production if needed
    });
  }
};

module.exports = convertMeetingTime;
