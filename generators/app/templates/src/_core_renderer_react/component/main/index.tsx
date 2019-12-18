// src/core_renderer/component/main/index.tsx

import React from "react";
import {inject, observer} from "mobx-react";
import {MemoryRouter as Router, Route, Switch} from "react-router-dom";

import config from "config.json";
import {IStateTheme} from "src/core_renderer/state/theme";


export interface IMainProps {
  state_theme?: IStateTheme;
}


@inject("state_theme")
@observer
export default class Main extends React.Component<IMainProps> {
  static defaultProps: IMainProps = {
    state_theme: undefined,
  };

  renderRoute() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact render={() => <div>{config.title}</div>} />
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

        <div style={{ padding: "10px" }}>
          {this.renderRoute()}
        </div>

      </div>
    );
  }
}

