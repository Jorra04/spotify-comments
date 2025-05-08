"use client";
import { useSearch } from "@/contexts";
import { capitalize } from "@/utils";
import styles from "./styles.module.css";
import Track from "./Track";
import Artist from "./Artist";
import Album from "./Album";
import cx from "classnames";
import { useMemo } from "react";
import { useSearchStore } from "@/stores";
import { useShallow } from "zustand/shallow";
export default function SearchResults() {
  const resultMap = {
    track: "tracks",
    artist: "artists",
    album: "albums",
  };

  const { selectedCategories, searchResults, searchQuery } = useSearchStore(
    useShallow((state) => state)
  );

  const getSearchResultJSX = (category, item, index) => {
    if (category === "track") {
      return <Track key={`${item.id}-${index}-track`} item={item} />;
    } else if (category === "artist") {
      return <Artist key={`${item.id}-${index}-artist`} item={item} />;
    } else if (category === "album") {
      return <Album key={`${item.id}-${index}-artist`} item={item} />;
    }
  };

  const getSearchResultsTitle = useMemo(() => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    return "Search results";
  }, [searchResults]);

  return (
    <div className={styles.searchResultsContainer}>
      <h1 className={styles.title}>{getSearchResultsTitle}</h1>
      {searchResults &&
        selectedCategories.map((category) => (
          <div key={category}>
            <h2 className={styles.categoryTitle}>
              {capitalize(resultMap[category])}
            </h2>
            <div
              className={cx(styles.categoryData, {
                [styles.tracks]: category === "track",
                [styles.artists]: category === "artist",
                [styles.albums]: category === "album",
              })}
            >
              {searchResults[resultMap[category]]?.items.map((item, index) => {
                return getSearchResultJSX(category, item, index);
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
