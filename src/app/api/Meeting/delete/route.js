import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { deleteCalendarEvent } from "@/config/googleCalendar";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Find the meeting
    const meeting = await prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      return NextResponse.json(
        { message: "Meeting not found" },
        { status: 404 }
      );
    }

    // Find the user linked to the meeting
    const user = await prisma.user.findUnique({
      where: { id: meeting.userId.toString() },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find the admin user (assuming you have only one admin or filter accordingly)
    const admin = await prisma.user.findFirst({
      where: { role: "admin" },
    });
    if (!admin) {
      return NextResponse.json(
        { message: "Admin user not found" },
        { status: 404 }
      );
    }

    // Delete event from Google Calendar for both user and admin tokens
    if (meeting.eventId) {
      // Delete event using user's token
      const deleteUserEventResponse = await deleteCalendarEvent(
        meeting.eventId,
        user.refreshToken
      );

      if (!deleteUserEventResponse?.success) {
        return NextResponse.json(
          { message: "Failed to delete the calendar event for user" },
          { status: 500 }
        );
      }

      // Delete event using admin's token
      const deleteAdminEventResponse = await deleteCalendarEvent(
        meeting.eventId,
        admin.refreshToken
      );

      if (!deleteAdminEventResponse?.success) {
        return NextResponse.json(
          { message: "Failed to delete the calendar event for admin" },
          { status: 500 }
        );
      }
    }

    // Delete the meeting from the DB
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
