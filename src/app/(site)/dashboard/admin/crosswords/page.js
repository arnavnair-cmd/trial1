"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AdminCrosswords.module.css";



export default function AdminCrosswordsPage() {
  const [puzzles, setPuzzles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPuzzles = async () => {
      const { data, error } = await supabase
        .from("crossword_puzzles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setPuzzles(data);
    };

    fetchPuzzles();
  }, []);

  const deletePuzzle = async (id) => {
    await supabase
      .from("crossword_puzzles")
      .delete()
      .eq("id", id);

    setPuzzles(prev => prev.filter(p => p.id !== id));
  };

 return (
  <div className={styles.wrapper}>
    <h2 className={styles.heading}>Manage Crosswords</h2>

    <button
      className={styles.createBtn}
      onClick={() =>
        router.push("/dashboard/admin/crosswords/new")
      }
    >
      + Create Puzzle
    </button>

    <hr className={styles.divider} />

    {puzzles.length === 0 && (
      <p className={styles.empty}>No puzzles yet.</p>
    )}

    <div className={styles.grid}>
      {puzzles.map((p) => (
        <div key={p.id} className={styles.card}>
          <strong className={styles.title}>
            {p.title}
          </strong>

          <div className={styles.actions}>
            <button
              className={styles.deleteBtn}
              onClick={() => deletePuzzle(p.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}