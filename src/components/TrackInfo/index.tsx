"use client";
import { useCurrentTrackStore } from "@/stores";
import { useShallow } from "zustand/shallow";
import styles from "./styles.module.css";
import { Avatar, Skeleton } from "@mui/material";
import { useSpotifyApi } from "@/effects";
import { useEffect } from "react";

export default function TrackInfo({ trackId }: { trackId: string }) {
  const { albumArt, title, artist } = useCurrentTrackStore(
    useShallow((state) => state.currentTrack)
  );
  const { getTrack, search } = useSpotifyApi();

  const handleGetTrack = async () => {
    try {
      const track = await getTrack(trackId);
      console.log("+++++trackdetails", track);
    } catch (error) {
      console.log("+++++error", error);
    }
  };

  useEffect(() => {
    handleGetTrack();
  }, [trackId]);

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
            <Avatar sx={{ width: 24, height: 24 }} />
            <p>{artist}</p>
          </div>
        </div>
      </div>
      <div className={styles.trackInfoBody}></div>
    </div>
  );
}
