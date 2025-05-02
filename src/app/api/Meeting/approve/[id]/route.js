import { PrismaClient } from "@prisma/client";
import { convertMeetingTime } from "@/middleware/convertMeetingTime";
import { createCalendarEvent } from "@/config/googleCalendar";

const prisma = new PrismaClient();

// This handles the POST request
export async function POST(req, { params }) {
  try {
    // Get the meeting ID from the URL parameters (params)
    const { id: paramId } = params;

    // Get the meeting ID from the request body
    const body = await req.json();
    const { id: bodyId } = body;

    // Ensure the ID from params and body match
    if (paramId !== bodyId) {
      return new Response(
        JSON.stringify({ error: "ID from body does not match ID from URL." }),
        { status: 400 }
      );
    }

    if (!paramId) {
      return new Response(
        JSON.stringify({ error: "Meeting ID is required." }),
        { status: 400 }
      );
    }

    // Find the meeting using the ID from the URL (or body, since they're the same)
    const meeting = await prisma.meeting.findUnique({ where: { id: paramId } });
    if (!meeting) {
      return new Response(JSON.stringify({ error: "Meeting not found." }), {
        status: 404,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: meeting.userId },
    });
    const admin = await prisma.user.findFirst({ where: { role: "admin" } });

    if (!user || !admin) {
      return new Response(
        JSON.stringify({ error: "User or admin not found." }),
        { status: 404 }
      );
    }

    const { startDateTime, endDateTime } = await convertMeetingTime(paramId);

    const calendarData = await createCalendarEvent({
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      adminAccessToken: admin.accessToken,
      adminRefreshToken: admin.refreshToken,
      startDateTime,
      endDateTime,
      title: meeting.title,
      description: "Meeting approved",
      location: "Virtual",
      attendees: [{ email: user.email }, { email: admin.email }],
    });

    const updatedMeeting = await prisma.meeting.update({
      where: { id: paramId },
      data: {
        type: "upcoming",
        meetingLink: calendarData.meetingLink,
        eventId: calendarData.eventId,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Meeting approved, calendar event created.",
        meeting: updatedMeeting,
        calendarData,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving meeting:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
