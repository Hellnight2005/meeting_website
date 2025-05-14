import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with env var in prod

export async function POST(req) {
  console.log("POST /api/meeting/get_by_user called");
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in request body" },
        { status: 400 }
      );
    }

    const meetings = await prisma.meeting.findMany({
      where: { userId },
      select: { id: true },
      orderBy: { startDateTime: "asc" },
    });

    if (!meetings || meetings.length === 0) {
      return NextResponse.json({ token: null }, { status: 200 });
    }

    const meetingIds = meetings.map((m) => m.id);

    const token = jwt.sign({ userId, meetingIds }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("[GET_MEETINGS_BY_USER]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
