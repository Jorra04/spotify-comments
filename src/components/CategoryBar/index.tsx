"use client";

import { useState } from "react";
import cx from "classnames";

import { capitalize } from "@/utils";

import styles from "./styles.module.css";

type CategoryBarProps = {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
};

export default function CategoryBar({
  selectedCategories,
  setSelectedCategories,
}: CategoryBarProps) {
  const handleCategoryClick = (category: string = "") => {
    if (selectedCategories.includes(category)) {
      // Only remove if there would still be at least one category selected
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
      }
    } else {
      // Add category if not selected
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className={styles.categoryBar}>
      {["track", "album", "artist", "playlist"].map((category) => (
        <button
          key={category}
          className={cx(styles.categoryButton, {
            [styles.selected]: selectedCategories.includes(category),
          })}
          onClick={() => handleCategoryClick(category)}
        >
          {capitalize(category)}
        </button>
      ))}
    </div>
  );
}
