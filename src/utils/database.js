import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fetch all meetings and format for Excel
export const getMeetingsFromDB = async () => {
  try {
    const meetings = await prisma.meeting.findMany();

    const formattedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        const user = await fetchUserById(meeting.userId);
        return formatMeetingForExcel(meeting, user);
      })
    );

    return formattedMeetings;
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

    if (!meeting) return null;

    const user = await fetchUserById(meeting.userId);
    return formatMeetingForExcel(meeting, user);
  } catch (error) {
    console.error("Error fetching meeting by ID:", error);
    throw new Error("Error fetching meeting by ID");
  }
};

// Utility: Fetch user by ID directly from DB (no API call)
const fetchUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User not found with ID ${userId}`);
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
};

// Utility: Format a meeting object for Excel
const formatMeetingForExcel = (meeting, user) => {
  return {
    userId: meeting.userId,
    user_name: user?.displayName || meeting.user_name,
    user_email: user?.email || "No email available",
    brandName: meeting.brandName || "",
    phoneNumber: meeting.phoneNumber || "",
    websiteUrl: meeting.websiteUrl || "",
    selectDay: meeting.selectDay,
    selectTime: meeting.selectTime,
    slot: meeting.slot,
    type: meeting.type,
    user_role: meeting.user_role,
    startDateTime: meeting.startDateTime,
    endDateTime: meeting.endDateTime,
    meetingLink: meeting.meetingLink,
    eventId: meeting.eventId,
  };
};
