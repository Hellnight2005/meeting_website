import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { deleteCalendarEvent } from "@/config/googleCalendar";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { selectDay, selectTime, slot, type } = body;

    if (!selectDay || !selectTime) {
      return NextResponse.json(
        { error: "New date, time, and slot are required." },
        { status: 400 }
      );
    }

    // 🔍 Check if meeting exists
    const existingMeeting = await prisma.meeting.findUnique({ where: { id } });
    if (!existingMeeting) {
      return NextResponse.json(
        { error: "Meeting not found." },
        { status: 404 }
      );
    }

    // 🔍 Get the user for the meeting
    const user = await prisma.user.findUnique({
      where: { id: existingMeeting.userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 🗑 Delete calendar event if exists
    if (existingMeeting.eventId) {
      const deleteResult = await deleteCalendarEvent(
        existingMeeting.eventId,
        user.refreshToken
      );

      if (!deleteResult.success) {
        return NextResponse.json(
          { error: "Failed to delete the calendar event." },
          { status: 500 }
        );
      }
    }

    // 🛠 Update meeting with new values and reset time + calendar fields
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        selectDay,
        selectTime,
        slot,
        type:
          existingMeeting.type === "upcoming" ? "line_up" : type || "line_up",
        startDateTime: null,
        endDateTime: null,
        meetingLink: null,
        eventId: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Meeting rescheduled successfully.",
      data: updatedMeeting,
    });
  } catch (error) {
    console.error("❌ Error in rescheduleMeeting:", error);
    return NextResponse.json(
      { error: "Failed to reschedule meeting." },
      { status: 500 }
    );
  }
}
