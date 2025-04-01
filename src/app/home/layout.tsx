"use client";
import { Playback, SearchArea } from "@/components";
import { PlaybackProvider, SearchProvider } from "@/contexts";
import { useQueryHandler } from "@/effects";
import styles from "./styles.module.css";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useQueryHandler();
  return (
    <SearchProvider>
      <PlaybackProvider>
        <div className={styles.homeContainer}>
          <div className={styles.searchContainer}>
            <SearchArea />
            {children}
          </div>
          <div className={styles.playbackContainer}>
            <Playback />
          </div>
        </div>
      </PlaybackProvider>
    </SearchProvider>
  );
}
