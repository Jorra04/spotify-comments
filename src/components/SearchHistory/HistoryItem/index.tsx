import styles from "./styles.module.css";
import { X } from "lucide-react";

interface HistoryItemProps {
  search: string;
  removeSearchHistory: (search: string) => void;
}

export default function HistoryItem({
  search,
  removeSearchHistory,
}: HistoryItemProps) {
  const handleRemoveItem = () => {
    removeSearchHistory(search);
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
