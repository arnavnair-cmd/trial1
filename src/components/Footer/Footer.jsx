'use client';

import styles from "./Footer.module.css";

function Footer() {
  return (
    <div>
      <p className={styles.footerdata}>
        Contact: False number
        <a href="#" className={styles.instaLink}>
          <br />
          Instagram
        </a>
      </p>
    </div>
  );
}

export default Footer;
