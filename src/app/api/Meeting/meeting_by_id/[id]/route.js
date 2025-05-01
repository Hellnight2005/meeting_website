// /pages/api/meeting/[id].js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Handle GET request to fetch a specific meeting by ID
export async function GET(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Meeting ID is required" },
      { status: 400 }
    );
  }

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: meeting });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle POST request to fetch meeting details using the meeting ID
export async function POST(req) {
  const { meetingId } = await req.json(); // Extract meeting ID from the body

  if (!meetingId) {
    return NextResponse.json(
      { error: "Meeting ID is required" },
      { status: 400 }
    );
  }

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: meeting });
  } catch (error) {
    console.error("Error fetching meeting data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
