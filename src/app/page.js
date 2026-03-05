"use client";
import Link from "next/link";
import styles from "./welcome.module.css";

export default function LandingPage() {
  return (
    <div className={styles.page}>

      {/* HERO SECTION */}

      <section className={styles.hero}>

        <div className={styles.heroText}>
          <h1>
            Explore the world of <span>Language</span>
          </h1>

          <p>
            Play with language, challenge your thinking,
            and discover the creativity of linguistics.
          </p>

          <Link href="/login" className={styles.cta}>
            🔐 Get Started
          </Link>
        </div>

        <div className={styles.heroImage}>
          <img src="/assets/lingsocLogo.png" />
        </div>

      </section>


      {/* FEATURES */}

      <section className={styles.features}>

        <div className={styles.card}>
          <h3>🧩 Crossword Challenges</h3>
          <p>Test your linguistic knowledge with interactive crossword puzzles.</p>
        </div>

        <div className={styles.card}>
          <h3>✍️ Essay Hub</h3>
          <p>Explore ideas and contribute essays about language and culture.</p>
        </div>

        <div className={styles.card}>
          <h3>🎮 ReBusted Game</h3>
          <p>Decode rebus puzzles and sharpen your thinking.</p>
        </div>

      </section>


      {/* CTA SECTION */}

      <section className={styles.ctaSection}>

        <h2>Join the Linguistics Community</h2>

        <Link href="/signup" className={styles.bigButton}>
          Create an Account
        </Link>

      </section>

    </div>
  );
}