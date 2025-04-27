import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { convertMeetingTime } from "@/middleware/convertMeetingTime";
import { createCalendarEvent } from "@/config/googleCalendar";
import { sendEmail } from "@/services/approve_email";

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

    // Fetch meeting and related users
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

    const selectDay = meeting.selectDay;
    const selectTime = meeting.selectTime;

    // Convert meeting time to start and end datetime
    const { startDateTime, endDateTime } = await convertMeetingTime(id);

    // Create Google Calendar event
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

    // Update meeting in the database
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        type: "upcoming",
        meetingLink: calendarData.meetingLink,
        eventId: calendarData.eventId,
      },
    });

    // Send email to user
    // await sendEmail(
    //   user.email,
    //   {
    //     title: meeting.title,
    //     selectDay,
    //     selectTime,
    //     location: "Virtual",
    //     meetingLink: calendarData.meetingLink,
    //   },
    //   admin.photoUrl
    // );

    return NextResponse.json({
      message: "Meeting approved, calendar event created, and email sent.",
      meeting: updatedMeeting,
      calendarData,
    });
  } catch (error) {
    console.error("Error approving meeting:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
