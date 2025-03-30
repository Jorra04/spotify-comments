import { SpotifyProvider } from "@/contexts";
import "./styles.module.css";
import "../styles/global.module.css";

import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/favicon.svg" }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const spotifyToken = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  });

  const { access_token: bearerToken } = await spotifyToken.json();

  return (
    <html lang="en">
      <head>
        <title>Spotify Comments</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={dmSans.className}>
        <SpotifyProvider bearerToken={bearerToken}>{children}</SpotifyProvider>
      </body>
    </html>
  );
}
