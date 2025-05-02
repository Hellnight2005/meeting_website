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
    });

    return events.data.items.length > 0;
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
  endDateTime,
  title,
  description = "Approved meeting",
  location,
  attendees = [],
}) => {
  if (!startDateTime || !endDateTime) {
    throw new Error("Missing start or end time for the meeting.");
  }

  try {
    startDateTime = new Date(startDateTime).toISOString();
    endDateTime = new Date(endDateTime).toISOString();
  } catch (err) {
    throw new Error("Invalid date format for start or end time.");
  }

  let adminEmail;
  try {
    const adminUser = await prisma.user.findFirst({ where: { role: "admin" } });
    if (adminUser) {
      adminEmail = adminUser.email;
    } else {
      throw new Error("Admin user not found.");
    }
  } catch (error) {
    throw new Error("Error fetching admin email.");
  }

  // Make admin as the organizer by using admin's access token
  const adminAuth = await getAuthorizedClient({
    accessToken: adminAccessToken,
    refreshToken: adminRefreshToken,
  });
  const adminCalendar = google.calendar({ version: "v3", auth: adminAuth });

  // Prepare event data
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
    location: location || undefined,
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
    const exists = await checkForExistingEvent(
      adminCalendar,
      startDateTime,
      endDateTime
    );
    if (exists) {
      throw new Error("Event already exists during this time.");
    }

    // Create the event on admin's calendar (admin will be organizer)
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
    await calendar.events.delete({ calendarId: "primary", eventId });

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
