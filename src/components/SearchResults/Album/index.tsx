import { useMemo } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function Album({ item }) {
  const router = useRouter();

  const imageProps = useMemo(
    () => ({
      src: item?.images[0]?.url || "/assets/albumPlaceholder.svg",
      alt: item?.name || "Album",
    }),
    [item]
  );

  const handleClick = () => {
    router.push(`/search/artist/${item?.id}`);
  };

  return (
    <div className={styles.albumContainer} role="button" onClick={handleClick}>
      <div className={styles.coverArtContainer}>
        <img className={styles.coverArt} {...imageProps} />
      </div>

      <div className={styles.trackInfo}>
        <h3 className={styles.trackName}>{item.name}</h3>
      </div>
    </div>
  );
}
