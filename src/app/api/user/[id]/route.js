import { PrismaClient } from "@prisma/client";
import { checkAuthType } from "@/middleware/vaildateUser";

const prisma = new PrismaClient();

async function handler(req, { params }) {
  const { id } = params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const PATCH = checkAuthType(handler);
