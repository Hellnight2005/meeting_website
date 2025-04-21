import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace in production

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: profile } = await oauth2.userinfo.get();

    let user = await prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          googleId: profile.id,
          email: profile.email,
          displayName: profile.name,
          photo: profile.picture,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
      });
    }

    // 🔐 Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        photo: user.photo,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Set HttpOnly cookie
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      "http://localhost:3000/login?error=google_auth_failed"
    );
  }
}
