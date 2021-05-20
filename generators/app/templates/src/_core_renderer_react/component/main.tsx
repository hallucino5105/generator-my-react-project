// src/core_renderer/component/main.tsx

import React from "react";
import { Observer } from "mobx-react";
import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import { useStore } from "src/core_renderer/store";
import { Index } from "./index/index";

export interface IMainProps {}

export const Main = (props: IMainProps) => {
  const { theme } = useStore("stateTheme");

  const renderRoute = () => {
    return (
      <Router>
        <Switch>
          <Route path="/" exact render={() => <Index />} />
          <Route exact render={() => <div>page not found</div>} />
        </Switch>
      </Router>
    );
  };

  return (
    <Observer>
      {() => (
        <div
          style={{
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            fontSize: "0.9rem",
            fontFamily: theme.font_family,
            fontWeight: theme.font_weight,
            color: theme.fg,
            backgroundColor: theme.bg,
          }}
        >
          <>{renderRoute()}</>
        </div>
      )}
    </Observer>
  );
};

