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
      {searchHistory.map((search) => (
        <HistoryItem
          key={search}
          search={search}
          setSearchHistory={setSearchHistory}
        />
      ))}
    </div>
  );
}
