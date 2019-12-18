// src/core_renderer/component/main/index.tsx

import React from "react";
import {inject, observer} from "mobx-react";
import Style from "style-it";

import config_json from "config.json";
import package_json from "package.json";
import {IStateTheme} from "src/core_renderer/state/theme;


export interface IMainProps {
  state_theme?: IStateTheme;
}


@inject("state_theme")
@observer
export default class Main extends React.Component<IMainProps> {
  static defaultProps: IMainProps = {
    state_theme: undefined,
  };

  render() {
    const {theme} = this.props.state_theme!;

    return (
      <div>
        {config_json.title}
      </div>
    );
  }
}

