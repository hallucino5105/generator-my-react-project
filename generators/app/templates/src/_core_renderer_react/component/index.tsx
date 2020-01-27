// src/core_renderer/component/index.tsx

import React from "react";
import { inject, observer } from "mobx-react";

import config_json from "config.json";
import { IGlobalState } from "src/core_renderer/store";

export interface IIndexProps extends IGlobalState {}

@inject("state_theme")
@observer
export default class Index extends React.Component<IIndexProps> {
  static defaultProps: IIndexProps = {
    state_theme: undefined,
  };

  render() {
    return (
      <div>
        {config_json.title}
      </div>
    );
  }
}

