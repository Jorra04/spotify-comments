import { TrackInfo } from "@/components";
import styles from "./styles.module.css";
import { cookies } from "next/headers";
import { millisToFormattedTime } from "@/utils";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: trackId } = await params;
  //@TODO: Clean this up
  const cookieStore = await cookies();
  const token = cookieStore.get("id_token")?.value;

  const trackResponse = await fetch(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const trackData = await trackResponse.json();

  const artistId = trackData?.artists?.[0]?.id;

  const artistResponse = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const artistData = await artistResponse.json();

  console.log("+++++artistData", artistData);
  console.log("+++++trackData", trackData);

  const {
    album: { images: albumImages, release_date: releaseDate },
    name: title,
    artists: [{ name: artist }],
  } = trackData;

  const {
    images: artistImages,
    followers: { total: totalFollowers },
  } = artistData;

  const props = {
    albumArt: albumImages[0]?.url,
    title,
    artist,
    releaseDate,
    duration: millisToFormattedTime(trackData.duration_ms),
    totalFollowers,
    artistImages: artistImages[0]?.url,
  };

  console.log("+++++props", props);

  return (
    <div className={styles.trackContainer}>
      <TrackInfo {...props} />
    </div>
  );
}
