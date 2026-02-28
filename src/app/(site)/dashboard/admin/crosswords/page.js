"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";



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
    <div>
      <h2>Manage Crosswords</h2>

      <button
        onClick={() =>
          router.push("/dashboard/admin/crosswords/new")
        }
      >
        Create Puzzle
      </button>

      <hr />

      {puzzles.length === 0 && <p>No puzzles yet.</p>}

      {puzzles.map((p) => (
        <div key={p.id} style={{ marginBottom: "10px" }}>
          <strong>{p.title}</strong>

          <div>
            <button
              onClick={() =>
                router.push(
                  `/dashboard/admin/crosswords/edit/${p.id}`
                )
              }
            >
              Edit
            </button>

            <button onClick={() => deletePuzzle(p.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}