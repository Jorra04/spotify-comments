import Header from "../Header";
import HeroSectionContainer from "./Container";
import styles from "./styles.module.css";
export default function HeroSection() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <HeroSectionContainer />
    </div>
  );
}
