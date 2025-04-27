// pages/api/send-email.js

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userEmail, meetingDetails, meetingId } = req.body;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Meeting Reschedule or Cancellation - Action Needed",
        html: `
          <div style="text-align: center; padding: 20px;">
            <h2>Meeting Reschedule or Cancellation</h2>
            <p>Your meeting titled "<strong>${meetingDetails.title}</strong>" is pending approval.</p>
            <p>Here are the details:</p>
            <ul style="list-style-type: none; padding: 0;">
              <li><strong>Date & Time:</strong> ${meetingDetails.selectDay} at ${meetingDetails.selectTime}</li>
              <li><strong>Location:</strong> ${meetingDetails.location}</li>
            </ul>
            <p>If you'd like to confirm and approve the meeting, click the "Approve" button below.</p>
            <p>If you'd prefer to delete this event and book a new one, click the "Delete" button.</p>
            <div style="margin-top: 20px;">
              <a href="${process.env.APP_URL}/api/meeting/approve/${meetingId}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; margin-right: 10px;">Approve Meeting</a>
              <a href="${process.env.APP_URL}/api/meeting/delete/${meetingId}" style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Delete Event</a>
            </div>
            <p>We look forward to your response!</p>
            <p>Best regards,</p>
            <p>The Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Error sending email." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
