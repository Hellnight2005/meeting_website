import { PrismaClient } from "@prisma/client";
import { checkAuthType } from "@/middleware/vaildateUser"; // fixed typo

const prisma = new PrismaClient();

async function handler(req, { params, user }) {
  const { id } = params;

  const User = await prisma.user.findUnique({ where: { id } });

  if (!User) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ User }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const PATCH = checkAuthType(handler);
