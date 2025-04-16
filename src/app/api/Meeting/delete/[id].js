import { deleteMeeting } from "@/controllers/meetingController";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.query;
    return deleteMeeting(req, res, id); // Delete a meeting by ID
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
