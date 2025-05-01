import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    // Check if the body exists and parse it
    let body = null;
    if (req.method === "POST") {
      body = await req.json().catch(() => null); // Safely catch JSON parse errors
    }

    // Fallback to params if body is empty or malformed
    const { id } = body || params;

    if (!id) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }

    // Fetch user from the database
    const User = await prisma.user.findUnique({ where: { id } });

    if (!User) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: User.id,
        email: User.email,
        displayName: User.displayName,
        photo: User.photo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ User, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(
      JSON.stringify({
        message: "Server error while processing the request",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
