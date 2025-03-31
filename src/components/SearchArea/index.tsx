import { CategoryBar, SearchBar, SearchHistory } from "..";

import styles from "./styles.module.css";

export default function SearchArea() {
  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.title}>Search</h1>
      <CategoryBar />
      <SearchBar />
      <SearchHistory />
    </div>
  );
}
