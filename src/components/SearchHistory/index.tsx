import styles from "./styles.module.css";
import HistoryItem from "./HistoryItem";
import { useSearchHistoryStore, useSearchStore } from "@/stores";
import { useShallow } from "zustand/shallow";

export default function SearchHistory() {
  const { searchHistory, setSearchHistory } = useSearchHistoryStore(
    useShallow((state) => ({
      searchHistory: state.searchHistory,
      setSearchHistory: state.setSearchHistory,
    }))
  );

  const removeSearchHistory = (search: string) => {
    const newHistory = searchHistory.filter((item) => item !== search);
    setSearchHistory(newHistory);
  };

  return (
    <div className={styles.searchHistory}>
      {searchHistory.map((search, index) => (
        <HistoryItem
          key={`search-${index}`}
          search={search}
          removeSearchHistory={removeSearchHistory}
        />
      ))}
    </div>
  );
}
