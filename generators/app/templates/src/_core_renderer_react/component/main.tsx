import React from "react";
import path from "path";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { observer } from "mobx-react";
import { useStateStore } from "src/core_renderer/store/state_store";
import { Index } from "./index/index";

export const Main = observer(() => {
  const { config } = useStateStore("StateGlobalConfig");

  const renderRoute = () => {
    return (
      <Router>
        <Switch>
          <Route path={config.serve.public_path} exact>
            <Index />
          </Route>

          <Route path={path.join(config.serve.public_path, "about")}>
            <div>about</div>
          </Route>

          <Route>
            <div>page not found</div>
          </Route>
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
      }}
    >
      <>{renderRoute()}</>
    </div>
  );
});

