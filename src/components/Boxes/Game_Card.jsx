'use client';

import styles from './Game_Card.module.css';
import Game_Button from '../Buttons/Game_Button';
import { useRouter } from 'next/navigation';

function Game_Card({ title, description, variant, route }) {
  const router = useRouter();

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>

      <div className={styles.actions}>
        <Game_Button
          text="Start"
          onClick={() => router.push(route)}
        />

        <Game_Button
          text="Ranks"
          onClick={() => router.push(`${route}/ranks`)}
        />
      </div>
    </div>
  );
}

export default Game_Card;
