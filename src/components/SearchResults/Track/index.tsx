import { getFirstValue } from "@/utils";
import styles from "./styles.module.css";
export default function Track({ item }) {
  if (!item) {
    console.log("+++item", item);
    return null;
  }

  return (
    <div className={styles.trackContainer}>
      <div className={styles.coverArtContainer}>
        <img
          className={styles.coverArt}
          src={item?.album?.images[0]?.url}
          alt={item?.album?.name}
          // width={item?.album?.images[2]?.width}
          // height={item?.album?.images[2]?.height}
          width={120}
          height={120}
        />
      </div>

      <div className={styles.trackInfo}>
        <h3 className={styles.trackName}>{item.name}</h3>
        <div className={styles.albumInfo}>
          <h4 className={styles.artistName}>
            {item?.artists?.map((artist) => artist.name).join(", ")}
          </h4>
          <span className={styles.divider}>•</span>
          <p className={styles.albumReleaseDate}>
            {getFirstValue(item?.album?.release_date)}
          </p>
        </div>
      </div>

      {/* add a backup image of a disk of there is no image */}
    </div>
  );
}
