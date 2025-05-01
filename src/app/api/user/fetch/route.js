import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const body = await req.json().catch(() => null);
    const id = body?.id || params?.id;

    if (!id) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        photo: user.photo,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ User: user, token }), {
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
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
