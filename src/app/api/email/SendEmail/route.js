import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, message } = await req.json(); // Parsing the request body

  // Ensure email and message are provided
  if (!email || !message) {
    return NextResponse.json(
      { error: "Email and message are required." },
      { status: 400 }
    );
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use a different email service
    auth: {
      user: process.env.EMAIL_USER, // Admin email address
      pass: process.env.EMAIL_PASS, // Admin email password or app-specific password
    },
  });

  const mailOptions = {
    from: email, // sender address
    to: process.env.EMAIL_USER, // admin email address
    subject: "New Contact Form Submission",
    text: `Message from ${email}: \n\n${message}`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }
}
