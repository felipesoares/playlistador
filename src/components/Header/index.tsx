import React from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";

import logo from "./../../images/logo.svg";

function Header() {
  return (
    <header className={styles.header}>
      <a href="/" title="">
        {/* <Link to="/" title="Playlistador"> */}
        <img src={logo} alt="Playlistador" className={styles.logo} />
        {/* </Link> */}
      </a>
    </header>
  );
}

export default Header;
