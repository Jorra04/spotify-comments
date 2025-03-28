import { useSearch } from "@/contexts";
import { capitalize } from "@/utils";
import styles from "./styles.module.css";
import Track from "./Track";

export default function SearchResults() {
  const resultMap = {
    track: "tracks",
    artist: "artists",
    album: "albums",
  };
  const { selectedCategories, searchResults } = useSearch();

  return (
    <div className={styles.searchResultsContainer}>
      <h1 className={styles.title}>Search results</h1>
      {searchResults &&
        selectedCategories.map((category) => (
          <div key={category}>
            <h2 className={styles.categoryTitle}>
              {capitalize(resultMap[category])}
            </h2>
            <div className={styles.categoryData}>
              {searchResults[resultMap[category]].items.map(
                (item) =>
                  category === "track" && <Track key={item.id} item={item} />
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
