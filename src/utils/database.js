import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMeetingsFromDB = async () => {
  try {
    // Fetch meetings data using Prisma
    const meetings = await prisma.meeting.findMany();

    // Map the Prisma meeting objects to the format you need for the Excel file
    return meetings.map((meeting) => ({
      userId: meeting.userId,
      user_name: meeting.user_name,
      title: meeting.title,
      selectDay: meeting.selectDay,
      selectTime: meeting.selectTime,
      slot: meeting.slot,
      type: meeting.type,
      user_role: meeting.user_role,
      startDateTime: meeting.startDateTime,
      endDateTime: meeting.endDateTime,
      meetingLink: meeting.meetingLink,
      eventId: meeting.eventId,
    }));
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw new Error("Error fetching meetings");
  }
};
