import React from "react";

import styles from "./Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.copyright}>Frontend Test • StudioSol • 2019</span>
    </footer>
  );
}

export default Footer;
