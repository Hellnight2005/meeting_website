import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { getMeetingById } from "@/utils/database"; // New Prisma function to fetch by ID

const filePath = path.join(process.cwd(), "public", "meetings.xlsx");

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const meetingId = searchParams.get("id");

  if (!meetingId) {
    return new Response("Meeting ID is required", { status: 400 });
  }

  try {
    // Fetch the meeting by ID
    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
      return new Response("Meeting not found", { status: 404 });
    }

    let finalData = [meeting];

    // Check for duplicates if file exists
    if (fs.existsSync(filePath)) {
      const existingFile = fs.readFileSync(filePath);
      const existingWorkbook = XLSX.read(existingFile, { type: "buffer" });

      const existingSheet = existingWorkbook.Sheets["Meetings"];
      const existingData = XLSX.utils.sheet_to_json(existingSheet || []);
      const exists = existingData.some((m) => m.eventId === meeting.eventId);

      if (!exists) {
        finalData = [...existingData, meeting];
      } else {
        finalData = existingData; // No changes if already exists
      }
    }

    // Add space at end
    const emptyRows = Array(5).fill({});
    const sheet = XLSX.utils.json_to_sheet([...finalData, ...emptyRows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Meetings");

    fs.writeFileSync(
      filePath,
      XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })
    );

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
