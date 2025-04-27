import nodemailer from "nodemailer";

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Or another service like Mailgun, SendGrid, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

const sendEmail = async (userEmail, meetingDetails, meetingId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Meeting Reschedule Confirmation",
      html: `
        <div style="text-align: center; padding: 20px;">
        
          <h2>Meeting Reschedule Confirmation</h2>
          <p>Hello,</p>
          <p>Your meeting titled "<strong>${meetingDetails.title}</strong>" has been successfully rescheduled.</p>
          <p>Here are the updated details:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Date & Time:</strong> ${meetingDetails.selectDay} at ${meetingDetails.selectTime}</li>
            <li><strong>Location:</strong> ${meetingDetails.location}</li>
          </ul>
          <p>If you are satisfied with the new schedule, no further action is needed.</p>
          <p>If you would like to request another reschedule or have any concerns about the time, please contact us.</p>

          <p>We look forward to your confirmation!</p>
          <p>Best regards,</p>
          <p>The Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully.");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Error sending email.");
  }
};

export { sendEmail };
