"use client";

import { useSpotify } from "@/contexts";
import { useSpotifyApi } from "@/effects";

import styles from "./styles.module.css";
import { useCallback } from "react";
import { useSearchHistoryStore, useSearchStore } from "@/stores";
import { useShallow } from "zustand/shallow";

export default function SearchBar() {
  const { search } = useSpotifyApi();

  const { searchHistory, setSearchHistory } = useSearchHistoryStore(
    useShallow((state) => ({
      searchHistory: state.searchHistory,
      setSearchHistory: state.setSearchHistory,
    }))
  );

  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    setSearchResults,
  } = useSearchStore(useShallow((state) => state));

  const handleSearch = async () => {
    const result = await search(searchQuery, {
      type: selectedCategories?.join(","),
    });

    const newHistory = [...searchHistory, searchQuery];
    setSearchHistory(newHistory);

    setSearchResults(result);
  };

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
