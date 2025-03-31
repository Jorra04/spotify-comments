import { useSearch } from "@/contexts";
import { capitalize } from "@/utils";
import styles from "./styles.module.css";
import Track from "./Track";
import Artist from "./Artist";
import cx from "classnames";
import { useMemo } from "react";
export default function SearchResults() {
  const resultMap = {
    track: "tracks",
    artist: "artists",
    album: "albums",
  };
  const { selectedCategories, searchResults, searchQuery } = useSearch();

  const getSearchResultJSX = (category, item, index) => {
    if (category === "track") {
      return <Track key={`${item.id}-${index}-track`} item={item} />;
    } else if (category === "artist") {
      return <Artist key={`${item.id}-${index}-artist`} item={item} />;
    }
  };

  const getSearchResultsTitle = useMemo(() => {
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    return "Search results";
  }, [searchQuery]);

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
              })}
            >
              {searchResults[resultMap[category]].items.map((item, index) => {
                return getSearchResultJSX(category, item, index);
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
