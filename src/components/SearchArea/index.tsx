"use client";

import { useState } from "react";

import { CategoryBar, SearchBar, SearchHistory } from "..";

import styles from "./styles.module.css";
import { useSpotifyApi } from "@/effects";
import { useSearch } from "@/contexts";

interface SearchResult {
  artists: {
    items: {
      images: { url: string; height: number; width: number }[];
    }[];
    name: string;
    genres: string[];
  };
  tracks: {
    items: {
      name: string;
      artists: {
        name: string;
      }[];
      album: {
        name: string;
        images: { url: string; height: number; width: number }[];
        release_date: string;
      };
    }[];
  };
}

export default function SearchArea() {
  const {
    selectedCategories,
    setSelectedCategories,
    searchQuery,
    setSearchQuery,
    setSearchResults,
  } = useSearch();
  const { search } = useSpotifyApi();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const handleSearch = async () => {
    const result = await search(searchQuery, {
      type: selectedCategories?.join(","),
    });

    setSearchHistory((oldHistory) => [...oldHistory, searchQuery]);

    setSearchResults(result);
  };

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.title}>Search</h1>
      <CategoryBar
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      <SearchHistory
        searchHistory={searchHistory}
        setSearchHistory={setSearchHistory}
      />
    </div>
  );
}
