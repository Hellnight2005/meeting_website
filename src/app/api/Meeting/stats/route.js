import { PrismaClient } from "@prisma/client";
import { startOfMonth, startOfWeek, isWithinInterval } from "date-fns";
const path = require("path");
import fs from "fs/promises";
import * as xlsx from "xlsx";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);
    const startOfCurrentWeek = startOfWeek(currentDate);
    const startOfCurrentMonthISO = startOfCurrentMonth.toISOString();

    // Fetch meetings from DB (this month)
    const meetingsFromDB = await prisma.meeting.findMany({
      where: {
        startDateTime: {
          gte: startOfCurrentMonthISO,
        },
      },
    });

    // Filter meetings within current week
    const meetingsThisWeekFromDB = meetingsFromDB.filter((meeting) =>
      isWithinInterval(new Date(meeting.startDateTime), {
        start: startOfCurrentWeek,
        end: currentDate,
      })
    );

    // Read Excel meetings
    const xmlFilePath = path.join(process.cwd(), "public", "meetings.xlsx");
    const fileBuffer = await fs.readFile(xmlFilePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const meetingsFromXLSX = xlsx.utils.sheet_to_json(sheet);

    // Count meetings from Excel & DB
    const totalMeetingsInXLSX = meetingsFromXLSX.length;
    const totalMeetingsInDB = meetingsFromDB.length;
    const totalMeetingsThisWeek = meetingsThisWeekFromDB.length;

    // New: Count users by device
    // Assuming User model has a 'device' field that can be 'mobile' or 'desktop'
    const mobileUsersCount = await prisma.user.count({
      where: { device: "mobile" },
    });

    const desktopUsersCount = await prisma.user.count({
      where: { device: "desktop" },
    });

    return new Response(
      JSON.stringify({
        totalMeetingsInXLSX,
        totalMeetingsInDB,
        totalMeetingsThisWeek,
        mobileUsersCount,
        desktopUsersCount,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
