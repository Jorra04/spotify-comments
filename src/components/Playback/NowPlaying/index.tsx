import Image from "next/image";
import styles from "./styles.module.css";
import { ALBUM_PLACEHOLDER_IMAGE } from "@/constants";
import { useRouter } from "next/navigation";
export type NowPlayingProps = {
  albumArtPath: string;
  title: string;
  artist: string;
};

export default function NowPlaying({
  albumArtPath = "",
  title,
  artist,
}: NowPlayingProps) {
  const router = useRouter();
  const routeToTrack = () => {
    router.push("/home/track");
  };
  return (
    <div className={styles.nowPlaying}>
      <button className={styles.nowPlayingButton} onClick={routeToTrack}>
        <img
          src={albumArtPath || ALBUM_PLACEHOLDER_IMAGE}
          alt="Now Playing"
          width={40}
          height={40}
          className={styles.nowPlayingImage}
        />
      </button>
      <div className={styles.nowPlayingInfo}>
        <div className={styles.nowPlayingTitle}>
          <p className={styles.nowPlayingTitleText}>{title || "Unknown"}</p>
        </div>
        <div className={styles.nowPlayingArtist}>
          <p className={styles.nowPlayingArtistText}>{artist || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
}
