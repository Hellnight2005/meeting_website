import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany();

    if (!meetings || meetings.length === 0) {
      return NextResponse.json(
        { message: "No meetings found" },
        { status: 200 }
      );
    }

    return NextResponse.json(meetings, { status: 200 });
  } catch (err) {
    console.error("Error fetching meetings:", err);
    return NextResponse.json(
      { message: "Server error while fetching meetings" },
      { status: 500 }
    );
  }
}
