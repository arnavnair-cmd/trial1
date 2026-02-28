'use client';

import styles from './Game_Card.module.css';
import Game_Button from '../Buttons/Game_Button';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function Game_Card({ title, description, variant, route }) {
  const router = useRouter();

  const handleStart = async () => {

    // ONLY affect crossword
    if (variant === "crossword") {
      const { data, error } = await supabase
        .from("crossword_puzzles")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        alert("No crossword available");
        return;
      }

      router.push(`/games/crossword/${data.id}`);
      return;
    }

    // Rebusted and everything else behaves EXACTLY the same
    router.push(route);
  };

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>

      <div className={styles.actions}>
        <Game_Button
          text="Start"
          onClick={handleStart}
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