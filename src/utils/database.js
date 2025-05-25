import { PrismaClient } from "@prisma/client";
import axios from "axios";

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

// Utility: Fetch user by ID
// Utility: Fetch user by ID
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Or your deployed URL

const fetchUserById = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/${userId}`, {
      method: "PATCH", // ✅ PATCH
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user with ID ${userId}`);
    }

    const data = await response.json();
    console.log("Fetched user data:", data.User);
    console.log("user email ", data.User.email);
    // 👈 Log the returned user data
    return data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
};

// Utility: Format a meeting object for Excel
const formatMeetingForExcel = (meeting, user) => {
  console.log("Formatting meeting:", meeting);
  console.log("User:", user); // Log the entire user object to check the data
  console.log("Email:", user?.User?.email); // Log the entire user object to check the data
  return {
    userId: meeting.userId,
    user_name: user?.User?.displayName || meeting.user_name, // Access displayName correctly
    user_email: user?.User?.email || "No email available",
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
