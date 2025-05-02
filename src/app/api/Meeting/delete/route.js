// app/api/meeting/delete/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { deleteCalendarEvent } from "@/config/googleCalendar";

export const dynamic = "force-dynamic"; // Ensure Vercel doesn't cache the route

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const { id } = await req.json(); // Expect JSON body with meeting ID

    if (!id) {
      return NextResponse.json(
        { message: "Meeting ID is required" },
        { status: 400 }
      );
    }

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

      if (!deleteEventResponse?.success) {
        return NextResponse.json(
          { message: "Failed to delete the calendar event" },
          { status: 500 }
        );
      }
    }

    // 4. Delete the meeting from the DB
    const deletedMeeting = await prisma.meeting.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Meeting deleted successfully",
      data: deletedMeeting,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete meeting", error: error.message },
      { status: 500 }
    );
  }
}
