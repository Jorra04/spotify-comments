import styles from "./styles.module.css";
import { X } from "lucide-react";

interface HistoryItemProps {
  search: string;
  setSearchHistory: (searchHistory: string[]) => void;
}

export default function HistoryItem({
  search,
  setSearchHistory,
}: HistoryItemProps) {
  const handleRemoveItem = () => {
    setSearchHistory((oldHistory) =>
      oldHistory.filter((item) => item !== search)
    );
  };
  return (
    <div className={styles.historyItem}>
      <h1 className={styles.title}>{search}</h1>
      <X
        color="white"
        onClick={handleRemoveItem}
        className={styles.removeButton}
      />
    </div>
  );
}
