import Game_Card from "@/components/Boxes/Game_Card";
import styles from "./Game_Page.module.css";

function Game_Page() {
  return (
    <div className={styles.page}>
      <div className={styles.boxes}>
        <Game_Card
          title="Crossword"
          description="Find all solutions using the clues provided"
          variant="crossword"
          route="/games/crossword"
        />

        <Game_Card
          title="Rebusted"
          description="Decipher images to uncover idioms, expressions and more"
          variant="rebusted"
          route="/games/rebusted"
        />
      </div>
    </div>
  );
}

export default Game_Page;