const { google } = require("googleapis");
const prisma = require("@/lib/prisma");
require("dotenv").config();

const createOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials.access_token;
  } catch (error) {
    throw new Error("Failed to refresh access token.");
  }
};

const getAuthorizedClient = async ({ accessToken, refreshToken }) => {
  const auth = createOAuthClient();
  auth.setCredentials({ access_token: accessToken });

  try {
    await google.calendar({ version: "v3", auth }).calendarList.list();
    return auth;
  } catch (err) {
    if (refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken);
      auth.setCredentials({ access_token: newAccessToken });
      return auth;
    } else {
      throw new Error("No valid access or refresh token provided.");
    }
  }
};

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
      maxResults: 5,
    });

    const isConflict = events.data.items.some((event) => {
      const existingStart = new Date(event.start.dateTime).getTime();
      const existingEnd = new Date(event.end.dateTime).getTime();
      const newStart = new Date(startDateTime).getTime();
      const newEnd = new Date(endDateTime).getTime();

      return newStart < existingEnd && newEnd > existingStart;
    });

    return isConflict;
  } catch (error) {
    throw new Error("Error checking for existing events.");
  }
};

const createCalendarEvent = async ({
  accessToken,
  refreshToken,
  adminAccessToken,
  adminRefreshToken,
  startDateTime,
  brandName,
  description = "Approved meeting",
  attendees = [],
}) => {
  if (!startDateTime) {
    throw new Error("Missing start time for the meeting.");
  }

  let startISO, endISO;
  try {
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour
    startISO = start.toISOString();
    endISO = end.toISOString();
  } catch {
    throw new Error("Invalid date format for start time.");
  }

  let adminEmail;
  try {
    const adminUser = await prisma.user.findFirst({ where: { role: "admin" } });
    if (!adminUser) throw new Error("Admin user not found.");
    adminEmail = adminUser.email;
  } catch {
    throw new Error("Error fetching admin email.");
  }

  const adminAuth = await getAuthorizedClient({
    accessToken: adminAccessToken,
    refreshToken: adminRefreshToken,
  });
  const adminCalendar = google.calendar({ version: "v3", auth: adminAuth });

  const event = {
    summary: `Meeting with ${brandName}`,
    description,
    start: {
      dateTime: startISO,
      timeZone: "UTC",
    },
    end: {
      dateTime: endISO,
      timeZone: "UTC",
    },
    location: "Virtual",
    attendees: attendees.length > 0 ? attendees : undefined,
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 1440 },
        { method: "popup", minutes: 1440 },
        { method: "email", minutes: 30 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  try {
    const exists = await checkForExistingEvent(adminCalendar, startISO, endISO);
    if (exists) {
      throw new Error("Event already exists during this time.");
    }

    const adminEvent = await adminCalendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    const videoLink =
      adminEvent.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video"
      )?.uri || null;

    return {
      eventId: adminEvent.data.id,
      htmlLink: adminEvent.data.htmlLink,
      meetingLink: videoLink,
      startDateTime: adminEvent.data.start.dateTime,
      endDateTime: adminEvent.data.end.dateTime,
    };
  } catch (error) {
    throw new Error("Error creating calendar event.");
  }
};

const deleteCalendarEvent = async (eventId, refreshToken) => {
  try {
    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  createCalendarEvent,
  refreshAccessToken,
  deleteCalendarEvent,
};
