"use client";

import { supabase } from "@/lib/supabase.js";
import { useState, useEffect, useCallback } from "react";
import styles from "../CrossWord.module.css";
import { useRouter } from "next/navigation";

import { useParams } from "next/navigation";



function TrialCross() {
  // At the top of your component

  const [user, setUser] = useState(null);



  /* ---------------- STATE ---------------- */

  const [userGrid, setUserGrid] = useState([]);

  const router = useRouter();

  const [crossword, setCrossword] = useState(null);
  const [acrossClues, setAcrossClues] = useState([]);
  const [downClues, setDownClues] = useState([]);


  const [activeCell, setActiveCell] = useState({ row: null, col: null });
  const [direction, setDirection] = useState("across");
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const params = useParams();
  const puzzleId = params.id;


  /* ---------------- CLUES ---------------- */



  /* ---------------- use effect ---------------- */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

 useEffect(() => {
  if (!puzzleId) return;

  const fetchPuzzle = async () => {
    const { data, error } = await supabase
      .from("crossword_puzzles")
      .select("*")
      .eq("id", puzzleId)
      .single();

    if (error) {
      console.error("Failed to load puzzle:", error);
      return;
    }

    setCrossword({
      rows: data.rows,
      cols: data.cols,
      grid: data.grid
    });

    setAcrossClues(data.across_clues);
    setDownClues(data.down_clues);
  };

  fetchPuzzle();
}, [puzzleId]);

useEffect(() => {
  if (!crossword || userGrid.length) return;

  setUserGrid(
    crossword.grid.map(row =>
      row.map(cell => (cell === null ? null : ""))
    )
  );
}, [crossword, userGrid.length]);

useEffect(() => {
  if (!user || !crossword) return;

  const loadProgress = async () => {
    const { data, error } = await supabase
      .from("crossword_user_progress")
      .select("grid")
      .eq("user_id", user.id)
      .eq("puzzle_id", puzzleId)
      .maybeSingle();

    if (error) {
      console.error("Load failed:", error);
      return;
    }

    if (data?.grid) {
      setUserGrid(data.grid);
    }
  };

  loadProgress();
}, [user, crossword,puzzleId]);

useEffect(() => {
  if (!isRunning) return;

  const interval = setInterval(() => {
    setSeconds(prev => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning]);

const saveProgress = useCallback(async () => {
  if (!user || !crossword) return;

  const { error } = await supabase
    .from("crossword_user_progress")
    .upsert(
      {
        user_id: user.id,
        puzzle_id: puzzleId,
        grid: userGrid,
        updated_at: new Date()
      },
      {
        onConflict: ["user_id", "puzzle_id"]
      }
    );

  if (error) {
    console.error("Save failed:", error);
  }
}, [user, crossword, userGrid]);

useEffect(() => {
  if (!user || !userGrid.length) return;

  const timeout = setTimeout(() => {
    saveProgress();
  }, 800);

  return () => clearTimeout(timeout);
}, [user, userGrid, saveProgress]);


/*--------------HELPERS-----------*/

const isClueStart = (r, c) => {
  if (crossword.grid[r][c] === null) return false;
  const startAcross = (c === 0 || crossword.grid[r][c - 1] === null) &&
    (c + 1 < crossword.cols && crossword.grid[r][c + 1] !== null);
  const startDown = (r === 0 || crossword.grid[r - 1][c] === null) &&
    (r + 1 < crossword.rows && crossword.grid[r + 1][c] !== null);
  return startAcross || startDown;
};

const evaluatePuzzle = () => {
  let correct = 0;
  let total = 0;
  let allFilled = true;

  for (let r = 0; r < crossword.rows; r++) {
    for (let c = 0; c < crossword.cols; c++) {
      const cell = crossword.grid[r][c];

      // skip black cells
      if (cell === null) continue;

      total++;

      const solution = cell.toUpperCase();
      const userValue = (userGrid[r][c] || "").toUpperCase();

      if (!userValue) allFilled = false;
      if (userValue === solution) correct++;
    }
  }

  return {
    correct,
    total,
    completed: correct === total && allFilled
  };
};

const getActiveClue = () => {
  const activeWordCells =
    activeCell.row === null ? [] : getActiveWordCells();

  if (!activeWordCells.length) return null;

  const startCell = activeWordCells[0];
  const clues = direction === "across" ? acrossClues : downClues;

  return (
    clues.find(
      c => c.row === startCell.row && c.col === startCell.col
    ) || null
  );
};

const saveAttempt = async (evalResult) => {
  console.log("SAVE ATTEMPT CALLED");
  const { data: authData } = await supabase.auth.getUser();
  console.log("Auth user:", authData);

  if (!authData?.user) {
    console.log("No logged in user");
    return;
  }

  console.log("Inserting attempt with puzzleId:", puzzleId);

  const { data, error } = await supabase
    .from("crossword_attempts")
    .insert({
      user_id: authData.user.id,
      puzzle_id: puzzleId,
      correct: evalResult.correct,
      total: evalResult.total,
      completed: evalResult.completed,
      time_seconds: seconds
    })
    .select();

  if (error) {
    console.error("INSERT ERROR:", error);
  } else {
    console.log("Inserted successfully:", data);
  }
};

const handleSubmit = async () => {
  console.log("HANDLE SUBMIT FIRED");
  if (isSubmitted) return;

  const evalResult = evaluatePuzzle();
  setResult(evalResult);
  setIsSubmitted(true);
  setIsRunning(false);

  await saveAttempt(evalResult);

  if (user && puzzleId) {
    await supabase
      .from("crossword_user_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("puzzle_id", puzzleId);
  }

  //  Redirect here
  //router.push();
};

const focusCell = (row, col, dir = null) => {
  if (dir) setDirection(dir);

  setActiveCell({ row, col });

  // wait for direction + state update
  setTimeout(() => {
    const input = document.querySelector(
      `input[data-row='${row}'][data-col='${col}']`
    );
    input?.focus();
  }, 0);
};


const getActiveWordCells = () => {
  const { row, col } = activeCell;

  // HARD GUARD — prevents all crashes
  if (
    row === null ||
    col === null ||
    row < 0 ||
    col < 0 ||
    row >= crossword.rows ||
    col >= crossword.cols ||
    crossword.grid[row][col] === null
  ) {
    return [];
  }

  const cells = [];

  if (direction === "across") {
    let c = col;
    //finds beginning of word
    while (c > 0 && crossword.grid[row][c - 1] !== null) c--;
    //gets word
    while (c < crossword.cols && crossword.grid[row][c] !== null) {
      cells.push({ row, col: c });
      c++;
    }
  } else {
    let r = row;
    //finds beg of word
    while (r > 0 && crossword.grid[r - 1][col] !== null) r--;
    //gets the word
    while (r < crossword.rows && crossword.grid[r][col] !== null) {
      cells.push({ row: r, col });
      r++;
    }
  }

  return cells;
};


const activeWordCells = getActiveWordCells();

const isActiveWordCell = (r, c) =>
  activeCell.row !== null &&
  activeWordCells.some(cell => cell.row === r && cell.col === c);


const findNextCell = (row, col) => {
  for (let r = row; r < crossword.rows; r++) {
    for (let c = r === row ? col + 1 : 0; c < crossword.cols; c++) {
      if (crossword.grid[r][c] !== null) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};



const formatTime = (s) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};



/* ---------------- INPUT ---------------- */

const handleInputChange = (row, col, value) => {
  const newGrid = userGrid.map(r => [...r]);
  newGrid[row][col] = value.toUpperCase();
  setUserGrid(newGrid);
  setActiveCell({ row, col });

  if (!value) return; // do nothing if input was deleted

  let newRow = row;
  let newCol = col;

  const moveNextCell = () => {
    if (direction === "across") {
      let c = col + 1;
      while (c < crossword.cols) {
        if (
          crossword.grid[row][c] !== null
        ) {
          newCol = c;
          return true;
        }
        c++;
      }
    } else {
      let r = row + 1;
      while (r < crossword.rows) {
        if (
          crossword.grid[r][col] !== null
        ) {
          newRow = r;
          return true;
        }
        r++;
      }
    }
    return false;
  };


  if (!moveNextCell()) {
    const next = findNextCell(row, col);
    if (next) {
      newRow = next.row;
      newCol = next.col;
    }
  }


  focusCell(newRow, newCol);
};


/* ---------------- KEYBOARD ---------------- */

const handleKeyDown = (e, row, col) => {
  if (e.key === "Backspace") {
    e.preventDefault(); // prevent default browser behavior

    let newRow = row;
    let newCol = col;

    const newGrid = userGrid.map(r => [...r]);

    if (newGrid[row][col]) {
      // Step 1: Delete current cell content
      newGrid[row][col] = "";
      setUserGrid(newGrid);
      return;
    }

    // Step 2: Move to previous editable cell
    const movePrevCell = () => {
      if (direction === "across") {
        newCol--;
        if (newCol < 0) { // wrap to previous row
          newRow--;
          if (newRow < 0) return false; // at top-left, can't move
          newCol = crossword.cols - 1;
        }
        while (newCol >= 0 && crossword.grid[newRow][newCol] === null) {
          newCol--;
          if (newCol < 0) {
            newRow--;
            if (newRow < 0) return false;
            newCol = crossword.cols - 1;
          }
        }
      } else {
        newRow--;
        if (newRow < 0) { // wrap to previous column
          newCol--;
          if (newCol < 0) return false; // at top-left, can't move
          newRow = crossword.rows - 1;
        }
        while (newRow >= 0 && crossword.grid[newRow][newCol] === null) {
          newRow--;
          if (newRow < 0) {
            newCol--;
            if (newCol < 0) return false;
            newRow = crossword.rows - 1;
          }
        }
      }
      return true;
    };

    if (movePrevCell()) {
      // Step 3: Delete content of previous cell
      if (newGrid[newRow][newCol]) newGrid[newRow][newCol] = "";
      setUserGrid(newGrid);
      focusCell(newRow, newCol);
    }

    return;
  }
  //let newRow = row;
  //let newCol = col;

  switch (e.key) {
    case "ArrowUp": {
      if (direction !== "down") setDirection("down");

      let r = row - 1;

      while (r >= 0 && crossword.grid[r][col] === null) {
        r--;
      }

      if (r >= 0) focusCell(r, col);
      e.preventDefault();
      return;
    }

    case "ArrowDown": {
      if (direction !== "down") {
        setDirection("down");
        setActiveCell({ row, col }); // re-anchor highlight
      }


      let r = row + 1;

      while (r < crossword.rows && crossword.grid[r][col] === null) {
        r++;
      }

      if (r < crossword.rows) focusCell(r, col);
      e.preventDefault();
      return;
    }


    case "ArrowLeft": {
      if (direction !== "across") setDirection("across");

      let c = col - 1;

      while (c >= 0 && crossword.grid[row][c] === null) {
        c--;
      }

      if (c >= 0) focusCell(row, c);
      e.preventDefault();
      return;
    }

    case "ArrowRight": {
      if (direction !== "across") setDirection("across");

      let c = col + 1;

      while (c < crossword.cols && crossword.grid[row][c] === null) {
        c++;
      }

      if (c < crossword.cols) focusCell(row, c);
      e.preventDefault();
      return;
    }


  }

};

/* ---------------- RENDER ---------------- */
if (!crossword) {
  return <div>Loading puzzle...</div>;
}



return (

  <div className={styles.wrapper} >

    {/* TIMER */}
    <div className={styles.timer}>
      ⏱ {formatTime(seconds)}
    </div>

    {/* HINTS SECTION */}
    <div className={styles.hintsSection}>
      {getActiveClue() && (
        <div className={styles.activeClue}>
          <strong>
            {direction === "across" ? "Across" : "Down"}{" "}
            {getActiveClue().number}.
          </strong>{" "}
          {getActiveClue().clue}
        </div>
      )}

      <div className={styles.clues}>
        <h3>Across</h3>
        {acrossClues.map(c => (
          <div
            key={c.number}
            className={styles.clue}
            onClick={() => focusCell(c.row, c.col, "across")}
          >
            {c.number}. {c.clue}
          </div>
        ))}

        <h3>Down</h3>
        {downClues.map(c => (
          <div
            key={c.number}
            className={styles.clue}
            onClick={() => focusCell(c.row, c.col, "down")}
          >
            {c.number}. {c.clue}
          </div>
        ))}
      </div>
    </div>

    {/* CROSSWORD GRID */}
    <div className={styles.cwCon}>
      {crossword.grid.map((row, r) => (
        <div key={r} className={styles.cwRow}>
          {row.map((cell, c) => (
            <div
              key={c}
              className={`${styles.cwCell}
              ${isActiveWordCell(r, c) ? styles.activeWord : ""}
              ${activeCell.row === r && activeCell.col === c ? styles.activeCell : ""}
              `}
              style={{ backgroundColor: cell === null ? "black" : "" }}
            >

              {isClueStart(r, c) && (
                <span className={styles.clueNum}>
                  {acrossClues.find(x => x.row === r && x.col === c)?.number ||
                    downClues.find(x => x.row === r && x.col === c)?.number}
                </span>
              )}

              {cell !== null && (
                <input
                  type="text"
                  maxLength={1}
                  value={userGrid[r]?.[c] ?? ""}
                  onFocus={() => {
                    if (isSubmitted) return;
                    setActiveCell({ row: r, col: c });
                    if (!isRunning) setIsRunning(true);
                  }}
                  onChange={e => handleInputChange(r, c, e.target.value)}
                  onKeyDown={e => handleKeyDown(e, r, c)}
                  data-row={r}
                  data-col={c}
                  className={styles.cwInput}
                  disabled={isSubmitted}
                  style={{
                    caretColor: "transparent",
                    userSelect: "none"
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* SUBMIT */}
    <div className={styles.submitContainer}>
      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={!user || isSubmitted}
      >
        Submit
      </button>
    </div>

    {/* RESULT */}
    {isSubmitted && result && (
      <div className={styles.result}>
        <p>Correct: {result.correct} / {result.total}</p>
        <p>Time: {formatTime(seconds)}</p>
      </div>
    )}

  </div>

);
}

export default TrialCross;