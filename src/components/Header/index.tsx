import styles from "./styles.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img
            className={styles.logo}
            src="/assets/logos/spotify-comments.svg"
            alt="Spotify Comments Logo"
          />
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="https://www.spotify.com/us/signup">
          <button className={styles.button}>Sign up</button>
        </Link>
        <Link href="/api/auth">
          <button className={styles.button}>Log in</button>
        </Link>
        <Link href="/about">
          <button className={styles.button}>About</button>
        </Link>
      </nav>
    </header>
  );
}
