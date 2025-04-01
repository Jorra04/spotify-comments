import { Calendar1, Clock, Users } from "lucide-react";
import styles from "./styles.module.css";
import { Avatar, Chip, Skeleton, Tooltip } from "@mui/material";
import { formatFollowers, dateToEngString, timeToEngString } from "@/utils";

export default function TrackInfo({
  albumArt,
  title,
  artist,
  releaseDate,
  duration,
  totalFollowers,
  artistImages,
}: {
  albumArt: string;
  title: string;
  artist: string;
  releaseDate: string;
  duration: string;
  totalFollowers: number;
  artistImages: string;
}) {
  return (
    <div className={styles.trackInfoContainer}>
      <div className={styles.trackInfoHeader}>
        <div className={styles.albumArtContainer}>
          <img
            src={albumArt || "/assets/albumPlaceholder.svg"}
            alt="track"
            className={styles.albumArt}
          />
        </div>
        <div className={styles.trackInfoDetails}>
          <h1>{title}</h1>
          <div className={styles.trackInfoArtist}>
            <Chip
              avatar={
                <Avatar sx={{ width: 24, height: 24 }} src={artistImages} />
              }
              color="primary"
              label={artist}
              sx={{ color: "white", cursor: "pointer" }}
            />
            <Tooltip title={`Release Date: ${dateToEngString(releaseDate)}`}>
              <Chip
                icon={<Calendar1 />}
                label={releaseDate}
                color="primary"
                sx={{ color: "white", cursor: "pointer" }}
              />
            </Tooltip>
            <Tooltip title={`Duration: ${timeToEngString(duration)}`}>
              <Chip
                icon={<Clock />}
                label={duration}
                color="primary"
                sx={{ color: "white", cursor: "pointer" }}
              />
            </Tooltip>

            <Tooltip title={`${formatFollowers(totalFollowers)} followers`}>
              <Chip
                icon={<Users />}
                label={formatFollowers(totalFollowers)}
                color="primary"
                sx={{ color: "white", cursor: "pointer" }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div className={styles.trackInfoBody}></div>
    </div>
  );
}
