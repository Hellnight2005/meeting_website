import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { getMeetingsFromDB } from "@/utils/database"; // Prisma function

const filePath = path.join(process.cwd(), "public", "meetings.xlsx");

export async function GET(req) {
  try {
    const newMeetings = await getMeetingsFromDB();

    let combinedMeetings = [...newMeetings];

    if (fs.existsSync(filePath)) {
      const existingFile = fs.readFileSync(filePath);
      const existingWorkbook = XLSX.read(existingFile, { type: "buffer" });

      const existingSheet = existingWorkbook.Sheets["Meetings"];
      const existingData = XLSX.utils.sheet_to_json(existingSheet || []);

      // Create a Set of eventIds for fast lookup
      const existingIds = new Set(existingData.map((m) => m.eventId));

      // Filter out meetings that already exist by eventId
      const filteredNewMeetings = newMeetings.filter(
        (m) => !existingIds.has(m.eventId)
      );

      combinedMeetings = [...existingData, ...filteredNewMeetings];
    }

    // Add some empty rows for spacing at the end (optional)
    const emptyRows = Array(5).fill({});
    const finalData = [...combinedMeetings, ...emptyRows];

    const sheet = XLSX.utils.json_to_sheet(finalData);
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
    console.error("Error exporting meetings:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
