import { getFirstValue } from "@/utils";
import styles from "./styles.module.css";
import { useMemo } from "react";
export default function Artist({ item }) {
  const imageProps = useMemo(
    () => ({
      src: item?.images[0]?.url || "/assets/albumPlaceholder.svg",
      alt: item?.name || "Artist",
    }),
    [item]
  );

  return (
    <div className={styles.trackContainer}>
      <div className={styles.coverArtContainer}>
        <img
          className={styles.coverArt}
          width={200}
          height={200}
          {...imageProps}
        />
      </div>

      <div className={styles.trackInfo}>
        <h3 className={styles.trackName}>{item.name}</h3>
      </div>

      {/* add a backup image of a disk of there is no image */}
    </div>
  );
}
