// src/core_renderer/component/main.tsx

import React from "react";
import { inject, observer } from "mobx-react";
import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import { IGlobalState } from "src/core_renderer/store";
import { Index } from "src/core_renderer/component/index";

export interface IMainProps extends IGlobalState {}

@inject("state_theme")
@observer
export class Main extends React.Component<IMainProps> {
  static defaultProps: Partial<IMainProps> = {};

  renderRoute() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact render={() => <Index />} />
          <Route exact render={() => <div>page not found</div>} />
        </Switch>
      </Router>
    );
  }

  render() {
    const {theme} = this.props.state_theme!;

    return (
      <div style={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        fontSize: "0.9rem",
        fontFamily: theme.font_family,
        fontWeight: theme.font_weight,
        color: theme.fg,
        backgroundColor: theme.bg,
      }}>
        <>
          {this.renderRoute()}
        </>
      </div>
    );
  }
}

