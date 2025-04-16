import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data: profile } = await oauth2.userinfo.get();

    // Look up existing user
    let user = await prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    if (user) {
      // Update tokens if needed
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        },
      });
    } else {
      // Create new user
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

    // Optionally: generate a JWT here and set it in a cookie/session

    return NextResponse.redirect("http://localhost:3000/Admin");
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect("http://localhost:3000/login");
  }
}
