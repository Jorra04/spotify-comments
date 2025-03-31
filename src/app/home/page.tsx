"use client";
import { SearchProvider, PlaybackProvider } from "@/contexts";
import { SearchArea, SearchResults, Playback } from "../../components";
import styles from "./styles.module.css";
export default function Page() {
  return (
    <SearchProvider>
      <PlaybackProvider>
        <div className={styles.homeContainer}>
          <div className={styles.searchContainer}>
            <SearchArea />
            <SearchResults />
          </div>
          <div className={styles.playbackContainer}>
            <Playback />
          </div>
        </div>
      </PlaybackProvider>
    </SearchProvider>
  );
}
