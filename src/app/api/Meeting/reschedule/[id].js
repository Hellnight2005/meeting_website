import { rescheduleMeeting } from "@/controllers/meetingController";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;
    return rescheduleMeeting(req, res, id); // Reschedule meeting by ID
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
