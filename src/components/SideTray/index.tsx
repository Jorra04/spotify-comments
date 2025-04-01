"use client";
import { CircleArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import { SearchArea } from "../";

export default function SideTray() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.sideTrayContainer}>
      <SearchArea>
        <div className={styles.buttonContainer}>
          <CircleArrowLeft size={48} color="white" onClick={handleBack} />
        </div>
      </SearchArea>
    </div>
  );
}
