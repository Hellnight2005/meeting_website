import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all meetings and format for Excel
export const getMeetingsFromDB = async () => {
  try {
    const meetings = await prisma.meeting.findMany();

    return meetings.map(formatMeetingForExcel);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw new Error("Error fetching meetings");
  }
};

// Fetch a single meeting by ID and format for Excel
export const getMeetingById = async (id) => {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
    });

    return meeting ? formatMeetingForExcel(meeting) : null;
  } catch (error) {
    console.error("Error fetching meeting by ID:", error);
    throw new Error("Error fetching meeting by ID");
  }
};

// Utility: Format a meeting object for Excel
const formatMeetingForExcel = (meeting) => ({
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
});
