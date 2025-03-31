import Image from "next/image";
import styles from "./styles.module.css";
import { usePlayback } from "@/contexts";
import { ALBUM_PLACEHOLDER_IMAGE } from "@/constants";
export default function NowPlaying() {
  const { selectedSongImage, title, artist } = usePlayback();
  return (
    <div className={styles.nowPlaying}>
      <img
        src={selectedSongImage || ALBUM_PLACEHOLDER_IMAGE}
        alt="Now Playing"
        width={40}
        height={40}
        className={styles.nowPlayingImage}
      />
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
