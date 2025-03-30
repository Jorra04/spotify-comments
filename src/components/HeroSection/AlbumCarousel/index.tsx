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

export default function AlbumCarousel() {
  const [albums, setAlbums] = useState(albumSvgs);
  const [animate, setAnimate] = useState(false);

  const handleSwipe = () => {
    setAlbums((prev) => [...prev.slice(1), prev[0]]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleSwipe();
    }, 5000);

    const animateTimeout = setTimeout(() => {
      setAnimate(true);
    }, 3000);

    // Cleanup function
    return () => {
      clearInterval(interval);
      clearTimeout(animateTimeout);
    };
  }, []); // Note: removed currentIndex from dependencies

  return (
    <div className={styles.carousel}>
      {albums.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Album ${index + 1}`}
          className={cx(styles.album, {
            [styles.swiping]: index === 0 && animate,
          })}
          style={{ zIndex: albums.length - index }}
        />
      ))}
    </div>
  );
}
