import React, { useState } from "react";
import { Helmet } from "react-helmet";

import styles from "./NotFound.module.scss";

export function NotFoundPage(props) {
  return (
    <main className={"main " + styles.notFound}>
      <Helmet>
        <title>Página não encontrada</title>
      </Helmet>
      <h1 className={styles.title}>Página não encontrada</h1>
    </main>
  );
}

export default NotFoundPage;
