import { PrismaClient } from "@prisma/client";
import { startOfMonth, startOfWeek, isWithinInterval } from "date-fns";
const path = require("path"); // Add this line to fix the path issue
import fs from "fs/promises"; // Ensure you're using fs.promises for async file operations
import * as xlsx from "xlsx";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Get the current date and the start of the current month and week
    const currentDate = new Date();
    const startOfCurrentMonth = startOfMonth(currentDate);
    const startOfCurrentWeek = startOfWeek(currentDate);

    // Convert to ISO string for Prisma query
    const startOfCurrentMonthISO = startOfCurrentMonth.toISOString();

    // Fetch meetings from the database for this month
    const meetingsFromDB = await prisma.meeting.findMany({
      where: {
        startDateTime: {
          gte: startOfCurrentMonthISO, // Use ISO string for the query
        },
      },
    });

    // Filter meetings that fall within the current week
    const meetingsThisWeekFromDB = meetingsFromDB.filter((meeting) =>
      isWithinInterval(new Date(meeting.startDateTime), {
        start: startOfCurrentWeek,
        end: currentDate,
      })
    );

    // Read the Excel file and extract meetings
    const xmlFilePath = path.join(process.cwd(), "public", "meetings.xlsx");
    const fileBuffer = await fs.readFile(xmlFilePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON
    const meetingsFromXLSX = xlsx.utils.sheet_to_json(sheet);

    // Count the total number of meetings from the Excel sheet
    const totalMeetingsInXLSX = meetingsFromXLSX.length;

    // Count the total meetings from the database (this month and week)
    const totalMeetingsInDB = meetingsFromDB.length;
    const totalMeetingsThisWeek = meetingsThisWeekFromDB.length;

    // Return the response with total meetings from Excel and the database
    return new Response(
      JSON.stringify({
        totalMeetingsInXLSX,
        totalMeetingsInDB,
        totalMeetingsThisWeek,
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
