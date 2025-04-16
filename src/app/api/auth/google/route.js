import { NextResponse } from "next/server";

export async function GET() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: "code",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  };

  const params = new URLSearchParams(options);

  const redirectUrl = `${rootUrl}?${params.toString()}`;
  return NextResponse.redirect(redirectUrl);
}
