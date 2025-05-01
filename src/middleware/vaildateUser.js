import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function checkAuthType(handler) {
  return async (req, res) => {
    try {
      const userId =
        req.headers["x-user-id"] ||
        req.query.id ||
        (["POST", "PATCH", "PUT"].includes(req.method)
          ? await req
              .json()
              .then((body) => body.userId)
              .catch(() => null)
          : null);

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hasTokens = user.accessToken && user.refreshToken;
      const userType = hasTokens ? "google" : "guest";

      if (user.type !== userType) {
        await prisma.user.update({
          where: { id: userId },
          data: { type: userType },
        });
      }

      // Attach user to the request object
      req.user = { ...user, type: userType };

      // Proceed with the original handler
      return handler(req, res);
    } catch (error) {
      console.error("checkAuthType error:", error);
      return res.status(500).json({
        message: "Server error while checking auth type",
        error: error.message,
      });
    }
  };
}
