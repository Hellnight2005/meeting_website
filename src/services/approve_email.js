import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { deleteCalendarEvent } from "@/config/googleCalendar";
import { sendEmail } from "@/config/nodemailer"; // Import the sendEmail function

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Extract request body
    const body = await req.json();
    const { id, selectDay, selectTime, slot, type } = body;

    // ⛔ Validate required fields
    if (!id || !selectDay || !selectTime) {
      return NextResponse.json(
        { error: "ID, new date, time, and slot are required." },
        { status: 400 }
      );
    }

    // 🔍 Check if the meeting exists
    const existingMeeting = await prisma.meeting.findUnique({ where: { id } });
    if (!existingMeeting) {
      return NextResponse.json(
        { error: "Meeting not found." },
        { status: 404 }
      );
    }

    // 🔍 Get the user associated with the meeting
    const user = await prisma.user.findUnique({
      where: { id: existingMeeting.userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 🗑 Delete existing calendar event if present
    if (existingMeeting.eventId) {
      if (!user.refreshToken) {
        return NextResponse.json(
          { error: "User's refresh token is missing." },
          { status: 400 }
        );
      }
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

    // 🛠 Reschedule the meeting and reset calendar-related fields
    const updatedMeeting = await prisma.meeting.update({
      where: { id },
      data: {
        selectDay,
        selectTime,
        slot,
        type:
          existingMeeting.type === "upcoming" ? "line_up" : type || "line_up",
        startDateTime: null, // Reset start and end time
        endDateTime: null,
        meetingLink: null, // Reset meeting link
        eventId: null, // Reset event ID
      },
    });

    // ✅ Send email after rescheduling
    await sendEmail(
      user.email,
      {
        title: updatedMeeting.title,
        selectDay: updatedMeeting.selectDay,
        selectTime: updatedMeeting.selectTime,
        location: "Google Meet", // Assuming Google Meet is the meeting location
      },
      updatedMeeting.id
    );

    // ✅ Return success message with updated meeting data
    return NextResponse.json({
      success: true,
      message: "Meeting rescheduled successfully.",
      data: updatedMeeting,
    });
  } catch (error) {
    // ❌ Handle unexpected errors
    console.error("❌ Error in rescheduleMeeting:", error);
    return NextResponse.json(
      { error: "Failed to reschedule meeting. Please try again later." },
      { status: 500 }
    );
  }
}
