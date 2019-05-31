// src/core_renderer/component/main/index.tsx

import React from "react";
import {inject, observer} from "mobx-react";

import config from "config.json";
import {ThemesType} from "src/core_renderer/state/theme";


export interface MainPropsType {
  state_theme?: ThemesType;
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

