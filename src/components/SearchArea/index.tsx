import { CategoryBar, SearchBar, SearchHistory } from "..";

import styles from "./styles.module.css";

export default function SearchArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>Search</h1>
        {children}
      </div>
      <CategoryBar />
      <SearchBar />
      <SearchHistory />
    </div>
  );
}
