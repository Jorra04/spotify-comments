import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    const authOptions = new URLSearchParams({
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: "authorization_code",
      client_id: process.env.SPOTIFY_CLIENT_ID as string,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
    });

    const bufferSeed = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const authOptionsString = authOptions.toString();
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(bufferSeed).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: authOptionsString,
    });

    const data = await response.json();
    const redirectUrl = new URL("/search", request.url);
    const token = data.access_token;
    redirectUrl.search = new URLSearchParams({
      access_token: token,
    }).toString();

    const responseObject = NextResponse.redirect(redirectUrl, {
      status: 302,
    });
    // Store token in a secure, httpOnly cookie
    responseObject.cookies.set({
      name: "id_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour expiry
      path: "/",
    });

    return responseObject;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Spotify API" },
      { status: 500 }
    );
  }
}
