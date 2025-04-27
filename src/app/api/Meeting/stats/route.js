import * as xlsx from "xlsx";
import fs from "fs/promises"; // Use fs.promises for async file handling
import path from "path";

const xmlFilePath = path.join(process.cwd(), "public", "meetings.xlsx");

export async function GET(req) {
  try {
    // Check if the Excel file exists asynchronously
    try {
      await fs.stat(xmlFilePath); // This checks if the file exists
    } catch (error) {
      return new Response("Excel file does not exist.", { status: 404 });
    }

    // Read the file into a workbook
    const fileBuffer = await fs.readFile(xmlFilePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet data to JSON
    const meetingsFromXLSX = xlsx.utils.sheet_to_json(sheet);

    // Count the total number of meetings in the Excel sheet
    const totalMeetingsInXLSX = meetingsFromXLSX.length;

    // Return the response with the count of total meetings from the Excel file
    return new Response(
      JSON.stringify({
        totalMeetingsInXLSX,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error reading meetings from Excel file:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
