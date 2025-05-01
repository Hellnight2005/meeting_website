import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Extract the body and userId
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    // Fetch meetings associated with the userId
    const meetings = await prisma.meeting.findMany({
      where: { userId },
      select: { id: true }, // Only return the ids of meetings
      orderBy: { startDateTime: "asc" },
    });

    // If no meetings found, return null token
    if (!meetings.length) {
      return NextResponse.json({ success: true, token: null });
    }

    // Create a JWT token with the meeting ids
    const meetingIds = meetings.map((m) => m.id);
    const meetingToken = jwt.sign(
      { meetings: meetingIds },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return the token in the response
    return NextResponse.json({ success: true, token: meetingToken });
  } catch (error) {
    console.error("[GET_MEETINGS_BY_USER]", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
