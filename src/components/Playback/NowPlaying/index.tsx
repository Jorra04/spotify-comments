import Image from "next/image";
import styles from "./styles.module.css";
import { ALBUM_PLACEHOLDER_IMAGE } from "@/constants";

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
  return (
    <div className={styles.nowPlaying}>
      <img
        src={albumArtPath || ALBUM_PLACEHOLDER_IMAGE}
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
