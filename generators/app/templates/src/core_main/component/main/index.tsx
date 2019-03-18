// src/react/component/main/index.tsx

import * as React from "react";
import {inject, observer} from "mobx-react";

import * as config from "config.json";
import {StateThemeType} from "src/core_main/state/theme";


interface MainPropsType {
  state_theme?: StateThemeType;
}


@inject("state_theme")
@observer
export default class Main extends React.Component<MainPropsType> {
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

        <div style={{
          padding: "10px",
        }}>
          {config.title}
        </div>

      </div>
    );
  }
}

