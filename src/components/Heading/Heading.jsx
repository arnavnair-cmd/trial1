'use client';

import styles from './Heading.module.css';
import { motion } from "framer-motion";

function Heading() {
  return (
    <header className={styles.logoHeader}>
      <motion.img
        src="/assets/lingsocLogo.png"
        layoutId="lingsocLogo"
        style={{ width: "110px" }}
      />
      <h1 className={styles.heading}>
        The Linguistics <br /> Society
      </h1>
    </header>
  );
}

export default Heading;
