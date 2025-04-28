import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { meetingId } = await req.json();

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in request body" },
        { status: 400 }
      );
    }

    const existingMeeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await prisma.meeting.update({
      where: { id: meetingId },
      data: { type: "completed" }, // lowercase 'completed' to match your frontend label (if needed)
    });

    // Return a success flag in the response
    return NextResponse.json(
      { success: true, message: "Meeting marked as complete." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to mark meeting complete:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
