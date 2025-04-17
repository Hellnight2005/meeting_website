import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const validTypes = ["upcoming", "line_up"];
const validRoles = ["user", "admin"];

function validateMeetingData({
  user_name,
  title,
  selectDay,
  selectTime,
  slot,
  user_role,
  type,
}) {
  if (
    !user_name ||
    !title ||
    !selectDay ||
    !selectTime ||
    !slot ||
    !user_role
  ) {
    return "All required fields (user_name, title, selectDay, selectTime, slot, user_role) must be filled.";
  }

  if (typeof slot !== "number" || slot <= 0) {
    return "Slot must be a positive number.";
  }

  if (type && !validTypes.includes(type)) {
    return `Invalid meeting type. Allowed: ${validTypes.join(", ")}.`;
  }

  if (!validRoles.includes(user_role.toLowerCase())) {
    return `Invalid user role. Allowed: ${validRoles.join(", ")}.`;
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

    // 🕒 Parse booking date & time
    const bookingDate = new Date(`${data.selectDay} ${data.selectTime}`);
    const now = new Date();

    if (isNaN(bookingDate)) {
      return NextResponse.json(
        { error: "Invalid date or time format." },
        { status: 400 }
      );
    }

    // ❌ Reject past bookings
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
        user_role: user.role || "user",
        title: data.title,
        selectDay: data.selectDay,
        selectTime: data.selectTime,
        slot: data.slot,
        type: data.type || "line_up",
      },
    });

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
