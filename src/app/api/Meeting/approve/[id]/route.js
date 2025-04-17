import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { convertMeetingTime } from "@/middleware/convertMeetingTime";
import { createCalendarEvent } from "@/config/googleCalendar";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Meeting ID is required." },
        { status: 400 }
      );
    }

    // ✅ Convert meeting time (assumes this returns ISO strings)
    const { startDateTime, endDateTime } = await convertMeetingTime(id);

    const now = new Date();
    const start = new Date(startDateTime);

    // ⛔ Reject if meeting is in the past
    if (start < now) {
      return NextResponse.json(
        { error: "Cannot approve meetings scheduled in the past." },
        { status: 400 }
      );
    }

    // ✅ Fetch meeting and related users
    const meeting = await prisma.meeting.findUnique({ where: { id } });
    const user = await prisma.user.findUnique({
      where: { id: meeting.userId },
    });
    const admin = await prisma.user.findFirst({ where: { role: "admin" } });

    if (!user || !admin) {
      return NextResponse.json(
        { error: "User or admin not found" },
        { status: 404 }
      );
    }

    // ✅ Create Google Calendar Event
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

    // ✅ Update meeting in DB
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        type: "upcoming",
        meetingLink: calendarData.user.meetingLink,
        eventId: calendarData.user.eventId,
      },
    });

    return NextResponse.json({
      message: "Meeting approved and calendar event created.",
      meeting: updatedMeeting,
      calendarData,
    });
  } catch (error) {
    console.error("Error approving meeting:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
