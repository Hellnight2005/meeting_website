import { PrismaClient } from "@prisma/client";
import { checkAuthType } from "@/middleware/vaildateUser";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function handler(req, res) {
  const { id } = req.query; // Get the ID from query params

  const User = await prisma.user.findUnique({ where: { id } });

  if (!User) {
    return res.status(404).json({ message: "User not found" });
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

  return res.status(200).json({ User, token });
}

// Wrap your handler with the checkAuthType middleware
export default checkAuthType(handler);
