import React from "react";
import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import { observer } from "mobx-react";
import { useStateStore } from "src/core_renderer/store/state_store";
import { Index } from "./index/index";

export const Main = observer(() => {
  const { theme } = useStateStore("stateTheme");

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
    <div
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        fontSize: "0.9rem",
        fontFamily: theme.fontFamily,
        fontWeight: theme.fontWeight,
        color: theme.color,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <>{renderRoute()}</>
    </div>
  );
});

