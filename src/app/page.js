'use client';

import Link from 'next/link';
import styles from './welcome.module.css';

export default function WelcomePage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Welcome to <span>The Linguistics Society</span>
        </h1>

        <p className={styles.subtitle}>
          Play with language. Explore ideas. Learn creatively.
        </p>

        <div className={styles.actions}>
          <Link href="/login" className={styles.secondaryBtn}>
            🔐 Login / SignUp
          </Link>
        </div>
      </div>
    </div>
  );
}
