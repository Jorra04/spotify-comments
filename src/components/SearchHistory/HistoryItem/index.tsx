"use client";
import { useSearchStore } from "@/stores";
import styles from "./styles.module.css";
import { X } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";

interface HistoryItemProps {
  search: string;
  removeSearchHistory: (search: string) => void;
}

export default function HistoryItem({
  search,
  result,
  removeSearchHistory,
}: HistoryItemProps) {
  const { setSearchResults, setSearchQuery } = useSearchStore(
    useShallow((state) => ({
      setSearchResults: state.setSearchResults,
      setSearchQuery: state.setSearchQuery,
    }))
  );

  const router = useRouter();
  const handleRemoveItem = () => {
    removeSearchHistory(search);
  };

  const handleClick = () => {
    setSearchResults(result);
    setSearchQuery(search);
    router.push(`/search`);
  };

  return (
    <button className={styles.historyItemBtn} onClick={handleClick}>
      <div className={styles.historyItem}>
        <h1 className={styles.title}>{search}</h1>
        <X
          color="white"
          onClick={handleRemoveItem}
          className={styles.removeButton}
        />
      </div>
    </button>
  );
}
