import { approveMeeting } from "@/controllers/meetingController";
import convertMeetingTime from "@/middleware/convertMeetingTime";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { id } = req.query;
    await convertMeetingTime(req, res, () => {}); // Convert meeting time before approval
    return approveMeeting(req, res, id); // Approve the meeting by ID
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
