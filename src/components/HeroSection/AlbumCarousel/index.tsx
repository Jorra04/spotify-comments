"use client";
import { useState, useEffect } from "react";
import cx from "classnames";
import styles from "./styles.module.css";

const albumSvgs = [
  "/assets/albums/abbeyRoad.png",
  "/assets/albums/bornToRun.png",
  "/assets/albums/darkSideOfTheMoon.png",
  "/assets/albums/hotelCalifornia.png",
  "/assets/albums/ledZeppelin_4.png",
];

// const albumColors = [
//   "#d0efff", // Abbey Road - bluish
//   "#E94B3C", // Born to Run - reddish
//   "#23074D", // Dark Side - deep purple
//   "#CAA846", // Hotel California - golden
//   "#D3756B", // Led Zeppelin - warm orange
// ];
const albumColors = [
  "#d0efff", // Abbey Road - bluish
  "#faff89", // Born to Run - reddish
  "#ffffff", // Dark Side - deep purple
  "#ffaf6b", // Hotel California - golden
  "#e8ffdc", // Led Zeppelin - warm orange
];

export default function AlbumCarousel() {
  const [albums, setAlbums] = useState(albumSvgs);
  const [currentIndex, setCurrentIndex] = useState(4);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setAlbums((prev) => [...prev.slice(1), prev[0]]);
    }, 3000);

    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, [isAnimating]); // Note: removed currentIndex from dependencies

  return (
    <div className={styles.carousel}>
      {albums.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Album ${index + 1}`}
          className={cx(styles.album, {
            [styles.swiping]: index === 0 && isAnimating,
          })}
          style={{ zIndex: albums.length - index }}
        />
      ))}
    </div>
  );
}
