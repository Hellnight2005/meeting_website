import * as XLSX from "xlsx";
import fs from "fs";

import path from "path";
import { getMeetingById } from "@/utils/database"; // Assuming this fetches the meeting by ID

const filePath = path.join(process.cwd(), "public", "meetings.xlsx");
console.log("File path:", filePath);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const meetingId = searchParams.get("id");

  if (!meetingId) {
    return new Response("Meeting ID is required", { status: 400 });
  }

  try {
    // Fetch the meeting by ID from the database
    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
      return new Response("Meeting not found", { status: 404 });
    }

    let finalData = [meeting];

    // Check if the Excel file exists, and handle duplicates
    if (fs.existsSync(filePath)) {
      const existingFile = fs.readFileSync(filePath);
      const existingWorkbook = XLSX.read(existingFile, { type: "buffer" });

      const existingSheet = existingWorkbook.Sheets["Meetings"];
      const existingData = XLSX.utils.sheet_to_json(existingSheet || []);
      const exists = existingData.some((m) => m.eventId === meeting.eventId);

      if (!exists) {
        // If not duplicate, add to the final data
        finalData = [...existingData, meeting];
      } else {
        // No changes if the meeting already exists
        finalData = existingData;
      }
    }

    // Create the sheet with the meetings data
    const sheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Meetings");

    // Write to the Excel file (or overwrite if it exists)
    fs.writeFileSync(
      filePath,
      XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })
    );

    // Return the file as an attachment
    return new Response(fs.readFileSync(filePath), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=meetings.xlsx",
      },
    });
  } catch (error) {
    console.error("Error exporting meeting:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
