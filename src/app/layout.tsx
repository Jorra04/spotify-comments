import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { SpotifyProvider } from "@/contexts";
import "./styles.module.css";
import "../styles/global.module.css";

import { Roboto } from "next/font/google";
import theme from "../theme";

import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
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
        <ThemeProvider theme={theme}>
          <SpotifyProvider bearerToken={bearerToken}>
            <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          </SpotifyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
