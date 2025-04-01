"use client";
import { useShallow } from "zustand/shallow";
import { getFirstValue } from "@/utils";
import styles from "./styles.module.css";
import { usePlayback } from "@/contexts";
import { useCurrentTrackStore } from "@/stores";
import { Tooltip } from "@mui/material";
export default function Track({ item }) {
  if (!item) {
    console.log("+++item", item);
    return null;
  }
  const setCurrentTrack = useCurrentTrackStore(
    useShallow((state) => state.setCurrentTrack)
  );

  const imagePath =
    item?.album?.images[0]?.url || "/assets/albumPlaceholder.svg";
  const artistName = item?.artists?.map((artist) => artist.name).join(", ");
  const trackName = item?.name;

  const handleTrackSelection = () => {
    setCurrentTrack({
      uri: item?.uri,
      albumArt: imagePath,
      title: trackName,
      artist: artistName,
      id: item?.id,
    });
  };

  return (
    <button
      className={styles.trackButton}
      type="button"
      aria-label={"play song"}
      onClick={handleTrackSelection}
    >
      <div className={styles.trackContainer}>
        <div className={styles.coverArtContainer}>
          <img
            className={styles.coverArt}
            src={imagePath || null}
            alt={item?.album?.name}
            width={120}
            height={120}
          />
        </div>

        <div className={styles.trackInfo}>
          <Tooltip title={trackName} arrow>
            <h3 className={styles.trackName}>{trackName}</h3>
          </Tooltip>
          <div className={styles.albumInfo}>
            <Tooltip title={artistName} arrow>
              <h4 className={styles.artistName}>{artistName}</h4>
            </Tooltip>

            <span className={styles.divider}>•</span>
            <p className={styles.albumReleaseDate}>
              {getFirstValue(item?.album?.release_date)}
            </p>
          </div>
        </div>

        {/* add a backup image of a disk of there is no image */}
      </div>
    </button>
  );
}
