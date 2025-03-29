"use client";
import { SearchProvider } from "@/contexts";
import { Search, SearchArea, SearchResults, Playback } from "../../components";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
export default function Page() {
  const searchParams = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    const token = searchParams.get("access_token");
    if (token) {
      localStorage.setItem("token", token);
      setAccessToken(token);
    }
  }, [searchParams]);
  return (
    <SearchProvider>
      <div className={styles.homeContainer}>
        <div className={styles.searchContainer}>
          <SearchArea />
          <SearchResults />
        </div>
        <div className={styles.playbackContainer}>
          <Playback accessToken={accessToken} />
        </div>
      </div>
    </SearchProvider>
  );
}
