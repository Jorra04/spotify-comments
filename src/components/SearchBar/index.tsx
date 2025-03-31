"use client";

import { useSpotify } from "@/contexts";
import { useSpotifyApi } from "@/effects";

import styles from "./styles.module.css";
import { useCallback } from "react";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
}: SearchProps) {
  const { search } = useSpotifyApi();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
