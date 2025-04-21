import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function checkAuthType(handler) {
  return async (req, ctx) => {
    try {
      // ✅ Await ctx.params if it exists
      const params =
        ctx?.params && typeof ctx.params.then === "function"
          ? await ctx.params
          : ctx.params;

      const userId =
        req.headers.get("x-user-id") ||
        params?.id ||
        (["POST", "PATCH", "PUT"].includes(req.method)
          ? await req
              .json()
              .then((body) => body.userId)
              .catch(() => null)
          : null);

      if (!userId) {
        return new Response(
          JSON.stringify({ message: "User ID is required" }),
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), {
          status: 404,
        });
      }

      const hasTokens = user.accessToken && user.refreshToken;
      const userType = hasTokens ? "google" : "guest";

      if (user.type !== userType) {
        await prisma.user.update({
          where: { id: userId },
          data: { type: userType },
        });
      }

      ctx.user = { ...user, type: userType };

      return handler(req, ctx);
    } catch (error) {
      console.error("checkAuthType error:", error);
      return new Response(
        JSON.stringify({
          message: "Server error while checking auth type",
          error: error.message,
        }),
        { status: 500 }
      );
    }
  };
}
