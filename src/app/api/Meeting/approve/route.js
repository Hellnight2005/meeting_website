import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { convertMeetingTime } from "@/middleware/convertMeetingTime";
import { createCalendarEvent } from "@/config/googleCalendar";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { id } = await req.json();

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
      brandName: meeting.brandName,
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
      { message: "Meeting approved", meeting: updatedMeeting },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving meeting:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
