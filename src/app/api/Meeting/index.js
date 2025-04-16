import { createMeeting, getAllMeetings } from "@/controllers/meetingController";

export default async function handler(req, res) {
  console.log(`Received ${req.method} request at /api/Meeting`);

  if (req.method === "POST") {
    console.log("Creating a new meeting...");
    return createMeeting(req, res);
  } else if (req.method === "GET") {
    console.log("Fetching all meetings...");
    return getAllMeetings(req, res);
  } else {
    console.log("Method not allowed");
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
