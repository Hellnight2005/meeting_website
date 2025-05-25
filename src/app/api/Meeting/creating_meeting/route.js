import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function validateMeetingData({
  user_name,
  selectDay,
  selectTime,
  slot,
  brandName,
  phoneNumber,
  websiteUrl,
}) {
  if (!user_name || !selectDay || !selectTime || !slot) {
    return "All required fields (user_name, title, selectDay, selectTime, slot) must be filled.";
  }

  if (typeof slot !== "number" || slot <= 0) {
    return "Slot must be a positive number.";
  }

  return null;
}

export async function POST(req) {
  try {
    const data = await req.json();

    const validationError = validateMeetingData(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!data.userId) {
      return NextResponse.json(
        { error: "userId is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const bookingDate = new Date(`${data.selectDay} ${data.selectTime}`);
    const now = new Date();

    if (isNaN(bookingDate)) {
      return NextResponse.json(
        { error: "Invalid date or time format." },
        { status: 400 }
      );
    }

    if (bookingDate < now) {
      return NextResponse.json(
        { error: "Cannot book a meeting in the past." },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.create({
      data: {
        userId: user.id,
        user_name: user.displayName,
        user_role: "user",

        selectDay: data.selectDay,
        selectTime: data.selectTime,
        slot: data.slot,
        type: "line_up",

        brandName: data.brandName || null,
        phoneNumber: data.phoneNumber || null,
        websiteUrl: data.websiteUrl || null,
      },
    });

    // 🔐 Generate JWT token with meeting ID

    // ✅ Return token in JSON response
    return NextResponse.json(
      {
        success: true,
        message: "Meeting created successfully.",
        data: meeting,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in createMeeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting." },
      { status: 500 }
    );
  }
}
