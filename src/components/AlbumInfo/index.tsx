import { Timer } from "lucide-react";
import styles from "./styles.module.css";
import { millisToFormattedTime } from "@/utils";
import { useMemo } from "react";

interface AlbumInfoProps {
  albumTitle: string;
  albumArt: string;
  artistName: string;
  releaseDate: string;
  numberOfSongs: number;
  trackList: Track[];
}
export default function AlbumInfo({
  albumTitle,
  albumArt,
  artistName,
  releaseDate,
  numberOfSongs,
  trackList,
}) {
  const totalFormattedDuration = useMemo(() => {
    const totalMillis = trackList.reduce(
      (sum, track) => sum + track.duration_ms,
      0
    );
    return millisToFormattedTime(totalMillis);
  }, [trackList]);

  function getTotalFormattedDuration(trackList) {}
  return (
    <div className={styles.albumView}>
      <div className={styles.header}>
        <img
          src={albumArt}
          alt={`${albumTitle} cover`}
          className={styles.albumArt}
        />
        <div className={styles.meta}>
          <span className={styles.label}>Album</span>
          <h1 className={styles.title}>{albumTitle}</h1>
          <p className={styles.subtitle}>
            {artistName} • {releaseDate} • {numberOfSongs} songs •{" "}
            {totalFormattedDuration}
          </p>
        </div>
      </div>

      <table className={styles.trackTable}>
        <thead>
          <tr>
            <th className={styles.left}>#</th>
            <th className={styles.left}>Title</th>
            <th className={styles.left}>Plays</th>
            <th className={styles.left}>
              <Timer />
            </th>
          </tr>
        </thead>
        <tbody>
          {trackList.map((track, index) => (
            <tr key={index} className={styles.trackData}>
              <td>{index + 1}</td>
              <td>{track.name}</td>
              <td>{`123,542`}</td>
              <td>{millisToFormattedTime(track.duration_ms)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
