// pages/api/meeting/get_by_user.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const meetings = await prisma.meeting.findMany({
      where: { userId },
      select: { id: true },
      orderBy: { startDateTime: "asc" },
    });

    const meetingIds = meetings.map((m) => m.id);

    if (!meetingIds.length) {
      return res.status(200).json({ token: null });
    }

    const token = jwt.sign({ meetings: meetingIds }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
