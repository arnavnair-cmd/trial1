'use client';

import styles from './Game_Button.module.css';

function Game_Button({ text, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
}

export default Game_Button;
