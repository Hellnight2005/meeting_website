import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { deleteCalendarEvent } from "@/config/googleCalendar";
import { logger } from "@/lib/logger"; // Optional logging

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const id = params.id;

  try {
    // 1. Find the meeting
    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      return NextResponse.json(
        { message: "Meeting not found" },
        { status: 404 }
      );
    }

    // 2. Find the user
    const user = await prisma.user.findUnique({
      where: { id: meeting.userId },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 3. Delete event from Google Calendar if it exists
    if (meeting.eventId) {
      const deleteEventResponse = await deleteCalendarEvent(
        meeting.eventId,
        user.refreshToken
      );

      if (!deleteEventResponse.success) {
        return NextResponse.json(
          { message: "Failed to delete the calendar event" },
          { status: 500 }
        );
      }
    }

    // 4. Delete the meeting
    const deletedMeeting = await prisma.meeting.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Meeting deleted successfully",
      data: deletedMeeting,
    });
  } catch (error) {
    logger?.error?.(`Error in deleteMeeting: ${error.message}`);
    return NextResponse.json(
      { message: "Failed to delete meeting" },
      { status: 500 }
    );
  }
}
