const { google } = require("googleapis");
const User = require("@/models/User");
const logger = require("@/utils/logger"); // Import the logger
require("dotenv").config();

// Create reusable OAuth client
const createOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
};

// Refresh Access Token using Refresh Token
const refreshAccessToken = async (refreshToken) => {
  try {
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();
    logger.info("✅ New access token generated.");
    return credentials.access_token;
  } catch (error) {
    logger.error(
      `❌ Failed to refresh access token: ${
        error?.response?.data || error.message
      }`
    );
    throw new Error("Failed to refresh access token.");
  }
};

// Check if overlapping event already exists
const checkForExistingEvent = async (calendar, startDateTime, endDateTime) => {
  try {
    const timeMin = new Date(startDateTime).toISOString();
    const timeMax = new Date(endDateTime).toISOString();

    const events = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    return events.data.items.length > 0;
  } catch (error) {
    logger.error(
      `❌ Error checking for existing events: ${
        error?.response?.data || error.message
      }`
    );
    throw new Error("Error checking for existing events.");
  }
};

// Create calendar event
const createCalendarEvent = async ({
  accessToken,
  refreshToken,
  adminAccessToken,
  adminRefreshToken,
  startDateTime,
  endDateTime,
  title,
  description = "Approved meeting",
  location,
  attendees = [],
}) => {
  if (!startDateTime || !endDateTime) {
    throw new Error("Missing start or end time for the meeting.");
  }

  logger.info("📅 Validating date inputs for calendar event...");

  try {
    startDateTime = new Date(startDateTime).toISOString();
    endDateTime = new Date(endDateTime).toISOString();
  } catch (err) {
    logger.error(`❌ Invalid date format provided: ${err.message}`);
    throw new Error("Invalid date format for start or end time.");
  }

  // Fetch the admin's email from the user model based on the role "Admin"
  let adminEmail;
  try {
    const adminUser = await User.findOne({ role: "admin" });
    if (adminUser) {
      adminEmail = adminUser.email;
    } else {
      throw new Error("Admin user not found.");
    }
  } catch (error) {
    logger.error(`❌ Error fetching admin email: ${error.message}`);
    throw new Error("Error fetching admin email.");
  }

  // Add admin as a guest in the attendees array
  const admin = {
    email: adminEmail, // Admin's email fetched from the User model
    displayName: "Admin",
  };

  attendees.push(admin); // Add admin to the attendees list

  // Setup OAuth clients
  const userAuth = createOAuthClient();
  userAuth.setCredentials({ access_token: accessToken });

  const userCalendar = google.calendar({ version: "v3", auth: userAuth });

  const event = {
    summary: title,
    description,
    start: {
      dateTime: startDateTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endDateTime,
      timeZone: "Asia/Kolkata",
    },
    ...(location && { location }),
    attendees, // Add both user and admin as attendees
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: { useDefault: true },
  };

  try {
    // 1️⃣ Check for event conflict in user's calendar
    const exists = await checkForExistingEvent(
      userCalendar,
      startDateTime,
      endDateTime
    );
    if (exists) throw new Error("Event already exists during this time.");

    // 2️⃣ Insert event into user's calendar
    const userEvent = await userCalendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    // 3️⃣ Return the event details
    const videoLink =
      userEvent.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video"
      )?.uri || null;

    logger.info("✅ Calendar event created successfully.");
    return {
      user: {
        eventId: userEvent.data.id,
        htmlLink: userEvent.data.htmlLink,
        meetingLink: videoLink,
        startDateTime: userEvent.data.start.dateTime,
        endDateTime: userEvent.data.end.dateTime,
      },
      admin: {
        eventId: userEvent.data.id, // Same event ID for admin
        htmlLink: userEvent.data.htmlLink, // Same event link for admin
        meetingLink: videoLink, // Same meeting link for admin
        startDateTime: userEvent.data.start.dateTime,
        endDateTime: userEvent.data.end.dateTime,
      },
    };
  } catch (error) {
    logger.error(
      `❌ Error during event creation: ${
        error?.response?.data || error.message
      }`
    );
    throw new Error("Error creating calendar event.");
  }
};

// Delete calendar event
const deleteCalendarEvent = async (eventId, refreshToken) => {
  try {
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
    });

    logger.info(`✅ Event ${eventId} deleted successfully.`);
    return { success: true };
  } catch (error) {
    logger.error(`❌ Error deleting calendar event: ${error.message}`);
    return { success: false, message: error.message };
  }
};

module.exports = {
  createCalendarEvent,
  refreshAccessToken,
  deleteCalendarEvent,
};
