import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import logo from "./logo.svg";
import "./App.scss";

import { routes } from "./routes";

import { DefaultLayout } from "./containers/DefaultLayout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/"
          render={routeProps => (
            <DefaultLayout {...routeProps} routes={routes} />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
