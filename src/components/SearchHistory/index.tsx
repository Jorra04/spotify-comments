import styles from "./styles.module.css";
import HistoryItem from "./HistoryItem";

interface SearchHistoryProps {
  searchHistory: string[];
  setSearchHistory: (searchHistory: string[]) => void;
}

export default function SearchHistory({
  searchHistory,
  setSearchHistory,
}: SearchHistoryProps) {
  console.log("+++searchHistory", searchHistory);
  return (
    <div className={styles.searchHistory}>
      {searchHistory.map((search, index) => (
        <HistoryItem
          key={`search-${index}`}
          search={search}
          setSearchHistory={setSearchHistory}
        />
      ))}
    </div>
  );
}
