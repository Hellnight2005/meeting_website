import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { checkAuthType } from "@/middleware/vaildateUser";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  // Ensure params are awaited before accessing
  const { id } = await params;

  const User = await prisma.user.findUnique({ where: { id } });

  if (!User) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  // ✅ Token with only selected fields
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
}
