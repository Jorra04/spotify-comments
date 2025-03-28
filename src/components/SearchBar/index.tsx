"use client";

import { useSpotify } from "@/contexts";
import useSpotifyApi from "@/effects/useSpotifyApi";

import styles from "./styles.module.css";

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

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
