import { AlbumInfo } from "@/components";
import styles from "./styles.module.css";
import { cookies } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: artistId } = await params;
  //@TODO: Clean this up
  const cookieStore = await cookies();
  const token = cookieStore.get("id_token")?.value;

  const albumResponse = await fetch(
    `https://api.spotify.com/v1/albums/${artistId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const albumData = await albumResponse.json();

  const trackList = albumData.tracks?.items;
  const totalTracks = albumData.total_tracks;
  const albumArt = albumData.images[0]?.url;
  const albumTitle = albumData.name;
  const releaseDate = albumData.release_date;
  const numberOfSongs = trackList?.length;
  const artistName = albumData.artists[0]?.name;

  console.log("+++ tracklist", trackList);

  const props = {
    albumArt,
    releaseDate,
    albumTitle,
    numberOfSongs,
    trackList,
    artistName,
  };

  return (
    <div className={styles.trackContainer}>
      <AlbumInfo {...props} />
    </div>
  );
}
