import moment from "moment";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const convertMeetingTime = async (meetingId) => {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  const rawDay = String(meeting.selectDay || "").trim();
  const rawTime = String(meeting.selectTime || "").trim();
  const slot = parseInt(meeting.slot, 10);

  const parts = rawDay.split(",");
  if (parts.length < 3) {
    throw new Error("Invalid selectDay format");
  }

  const datePart = `${parts[1].trim()}, ${parts[2].trim()}`;
  const fullDateTime = `${datePart} ${rawTime}`;

  const m = moment(fullDateTime, "MMMM D, YYYY h:mm A", true);
  if (!m.isValid() || isNaN(slot) || slot <= 0) {
    throw new Error("Invalid meeting time or slot");
  }

  const startDate = m.toDate();
  const endDate = new Date(startDate.getTime() + slot * 60 * 1000);

  // Save start/end times to DB
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
