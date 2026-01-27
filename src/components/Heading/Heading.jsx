'use client';

import styles from './Heading.module.css';

function Heading() {
  return (
    <header className={styles.logoHeader}>
      <img
        src="/assets/lingsocLogo.png"
        alt="Linguistic Society Logo"
        className={styles.logo}
      />
      <h1 className={styles.heading}>
        The Linguistics <br /> Society
      </h1>
    </header>
  );
}

export default Heading;
