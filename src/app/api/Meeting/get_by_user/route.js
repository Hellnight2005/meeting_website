import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const meetings = await prisma.meeting.findMany({
      where: { userId },
      select: { id: true }, // only return ids
      orderBy: { startDateTime: "asc" },
    });

    if (!meetings.length) {
      return NextResponse.json({ success: true, token: null });
    }

    const meetingIds = meetings.map((m) => m.id);

    const meetingToken = jwt.sign(
      { meetings: meetingIds },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ success: true, token: meetingToken });
  } catch (error) {
    console.error("[GET_MEETINGS_BY_USER]", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
