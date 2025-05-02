import { PrismaClient } from "@prisma/client";
import { convertMeetingTime } from "@/middleware/convertMeetingTime";
import { createCalendarEvent } from "@/config/googleCalendar";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ✅ Add this GET handler for testing
// Change POST to PUT
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Meeting ID is required." },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      return NextResponse.json(
        { error: "Meeting not found." },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: meeting.userId },
    });
    const admin = await prisma.user.findFirst({ where: { role: "admin" } });

    if (!user || !admin) {
      return NextResponse.json(
        { error: "User or admin not found." },
        { status: 404 }
      );
    }

    const { startDateTime, endDateTime } = await convertMeetingTime(id);

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
      where: { id },
      data: {
        type: "upcoming",
        meetingLink: calendarData.meetingLink,
        eventId: calendarData.eventId,
      },
    });

    return NextResponse.json(
      {
        message: "Meeting approved, calendar event created.",
        meeting: updatedMeeting,
        calendarData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving meeting:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
