import styles from "./styles.module.css";
import AlbumCarousel from "../AlbumCarousel";
import { CommentCardPopup } from "@/components";
export default function HeroSectionContainer() {
  return (
    <div className={styles.hero}>
      <div className={styles.descriptionContainer}>
        <div className={styles.descriptionTextContainer}>
          <h1 className={styles.title}>
            Spotify <span className={styles.titleSpan}>Comments</span>
          </h1>
          <h2 className={styles.description}>
            The social network for music lovers.
          </h2>
        </div>
        <CommentCardPopup />
      </div>
      <AlbumCarousel />
    </div>
  );
}
