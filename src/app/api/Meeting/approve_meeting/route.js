import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch meetings with non-null eventId
    const meetings = await prisma.meeting.findMany({
      where: {
        NOT: {
          eventId: null,
        },
      },
    });

    if (!meetings || meetings.length === 0) {
      return NextResponse.json({
        message: "No meetings found with eventId",
        noData: true,
        approvedMeetings: [],
      });
    }

    // Group by selectDay
    const grouped = {};

    meetings.forEach((meeting) => {
      const day = meeting.selectDay;
      const time = meeting.selectTime;

      if (!grouped[day]) {
        grouped[day] = {
          day,
          times: [],
        };
      }

      grouped[day].times.push({
        time,
        meetingId: meeting.id,
      });
    });

    const approvedMeetings = Object.values(grouped);

    return NextResponse.json({ approvedMeetings });
  } catch (err) {
    console.error("Error fetching meetings:", err);
    return NextResponse.json(
      { message: "Server error while fetching meetings" },
      { status: 500 }
    );
  }
}
