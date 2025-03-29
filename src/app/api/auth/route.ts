import { generateRandomString } from "@/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const scope = "streaming user-read-email user-read-private";

    const state = generateRandomString(16);

    const auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state: state,
    });
    const queryParams = auth_query_parameters.toString();
    const redirectUrl = `https://accounts.spotify.com/en/authorize/?${queryParams}`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Spotify API" },
      { status: 500 }
    );
  }
}
