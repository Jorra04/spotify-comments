"use client";
import { CircleArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./styles.module.css";
import { SearchArea } from "../";
import { useEffect, useState } from "react";

export default function SideTray() {
  const router = useRouter();
  const pathName = usePathname();

  const [backButtonDisabled, setBackButtonDisabled] = useState(false);

  const handleBack = () => {
    if (backButtonDisabled) return;
    router.back();
  };

  useEffect(() => {
    setBackButtonDisabled(pathName === "/search");
  }, [pathName]);

  return (
    <div className={styles.sideTrayContainer}>
      <SearchArea>
        <div className={styles.buttonContainer}>
          <CircleArrowLeft
            size={48}
            color={backButtonDisabled ? "grey" : "white"}
            onClick={handleBack}
          />
        </div>
      </SearchArea>
    </div>
  );
}
