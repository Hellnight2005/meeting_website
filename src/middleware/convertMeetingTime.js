import moment from "moment-timezone";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const convertMeetingTime = async (meetingId) => {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  const rawDay = String(meeting.selectDay || "").trim();
  const rawTime = String(meeting.selectTime || "").trim();

  const parts = rawDay.split(",");
  if (parts.length < 3) {
    throw new Error("Invalid selectDay format");
  }

  const datePart = `${parts[1].trim()}, ${parts[2].trim()}`;
  const fullDateTime = `${datePart} ${rawTime}`;

  // Parse in IST, then convert to UTC
  const m = moment.tz(fullDateTime, "MMMM D, YYYY h:mm A", "Asia/Kolkata");

  if (!m.isValid()) {
    throw new Error("Invalid date or time format");
  }

  const startDate = m.utc().toDate(); // UTC start time
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      startDateTime: startDate.toISOString(),
      endDateTime: endDate.toISOString(),
    },
  });

  return {
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString(),
  };
};
