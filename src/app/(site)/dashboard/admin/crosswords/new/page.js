"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "./CreateCrossword.module.css";

export default function CreateCrossword() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [grid, setGrid] = useState(
    Array(5).fill().map(() => Array(5).fill(""))
  );

  const [acrossClues, setAcrossClues] = useState([]);
  const [downClues, setDownClues] = useState([]);

  /* ---------------- GENERATE CLUES FUNCTION ---------------- */

  const generateCluesFromGrid = (grid) => {
    const rows = grid.length;
    const cols = grid[0].length;

    let clueNumber = 1;
    const across = [];
    const down = [];

    const isClueStart = (r, c) => {
      if (grid[r][c] === null) return false;

      const startAcross =
        (c === 0 || grid[r][c - 1] === null) &&
        (c + 1 < cols && grid[r][c + 1] !== null);

      const startDown =
        (r === 0 || grid[r - 1][c] === null) &&
        (r + 1 < rows && grid[r + 1][c] !== null);

      return startAcross || startDown;
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!isClueStart(r, c)) continue;

        const startAcross =
          (c === 0 || grid[r][c - 1] === null) &&
          (c + 1 < cols && grid[r][c + 1] !== null);

        const startDown =
          (r === 0 || grid[r - 1][c] === null) &&
          (r + 1 < rows && grid[r + 1][c] !== null);

        if (startAcross) {
          across.push({ number: clueNumber, row: r, col: c, clue: "" });
        }

        if (startDown) {
          down.push({ number: clueNumber, row: r, col: c, clue: "" });
        }

        clueNumber++;
      }
    }

    return { across, down };
  };

  /* ---------------- AUTO GENERATE CLUES ---------------- */

  useEffect(() => {
    const { across, down } = generateCluesFromGrid(grid);
    setAcrossClues(across);
    setDownClues(down);
  }, [grid]);

  useEffect(() => {
    console.log("GRID : ", grid)
  },[grid]);

  /* ---------------- GRID HANDLERS ---------------- */

  const toggleBlack = (r, c) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = newGrid[r][c] === null ? "" : null;
    setGrid(newGrid);
  };

  const handleLetterChange = (r, c, value) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = value.toUpperCase();
    setGrid(newGrid);
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    const { data, error } = await supabase
      .from("crossword_puzzles")
      .insert({
        title,
        rows: grid.length,
        cols: grid[0].length,
        grid,
        across_clues: acrossClues,
        down_clues: downClues
      })
      .select();

    if (error) {
      console.error("SAVE ERROR:", error);
      alert("Error saving puzzle. Check console.");
      return;
    }

    console.log("Saved puzzle:", data);

    router.push("/dashboard/admin/crosswords");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Create Crossword</h1>

      <input
        className={styles.titleInput}
        placeholder="Enter Puzzle Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className={styles.mainGrid}>

        {/* LEFT - GRID */}
        <div className={styles.gridCard}>
          <div className={styles.grid}>
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`${styles.cell} ${cell === null ? styles.blackCell : ""}`}
                >
                  {cell !== null && (
                    <input
                      value={cell}
                      onChange={(e) =>
                        handleLetterChange(r, c, e.target.value)
                      }
                      maxLength={1}
                      className={styles.cellInput}
                    />
                  )}
                </div>
              ))
            )}
          </div>

        </div>

        {/* RIGHT - CLUES */}
        <div className={styles.clueCard}>

          <div>
            <h3>Across</h3>
            {acrossClues.map((clue, index) => (
              <div key={index} className={styles.clueRow}>
                <span>{clue.number}.</span>
                <input
                  value={clue.clue}
                  onChange={(e) => {
                    const updated = [...acrossClues];
                    updated[index].clue = e.target.value;
                    setAcrossClues(updated);
                  }}
                />
              </div>
            ))}
          </div>

          <div>
            <h3>Down</h3>
            {downClues.map((clue, index) => (
              <div key={index} className={styles.clueRow}>
                <span>{clue.number}.</span>
                <input
                  value={clue.clue}
                  onChange={(e) => {
                    const updated = [...downClues];
                    updated[index].clue = e.target.value;
                    setDownClues(updated);
                  }}
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      <button className={styles.saveBtn} onClick={handleSave}>
        Save Puzzle
      </button>
    </div>
  );
}