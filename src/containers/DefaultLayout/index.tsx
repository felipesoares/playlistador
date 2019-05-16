import React, { Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import styles from "./DefaultLayout.module.scss";

import { Header, Footer } from "../../components";

export function DefaultLayout(props) {
  const { routes } = props;

  return (
    <div className={styles.DefaultLayout}>
      <Header />
      <BrowserRouter>
        <Suspense fallback={<main className="main">Carregando...</main>}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  render={props => (
                    <route.component {...props} name={route.name} />
                  )}
                  // render={props => <route.component {...props} />}
                />
              ) : null;
            })}
          </Switch>
        </Suspense>
      </BrowserRouter>
      <Footer />
    </div>
  );
}
