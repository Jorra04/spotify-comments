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

  const tracks = albumData.tracks.items;
  const totalTracks = albumData.total_tracks;
  const albumArt = albumData.images[0]?.url;
  const albumName = albumData.name;
  const albumReleaseData = albumData.release_date;

  console.log("+++ albumresponse", tracks);

  return (
    <div className={styles.trackContainer}>
      {tracks.map((track) => track.name)}
      <p>{totalTracks}</p>
      <p>{albumArt}</p>
      <p>{albumName}</p>
      <p>{albumReleaseData}</p>
    </div>
  );
}
