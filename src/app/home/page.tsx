"use client";
import { SearchProvider } from "@/contexts";
import { Search, SearchArea, SearchResults } from "../../components";
import styles from "./styles.module.css";

export default function Page() {
  return (
    <div className={styles.homeContainer}>
      <SearchProvider>
        <SearchArea />
        <SearchResults />
      </SearchProvider>
    </div>
  );
}
