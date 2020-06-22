// src/core_renderer/component/index.tsx

import os from "os";

import React from "react";
import { inject, observer } from "mobx-react";
import Style from "style-it";

import config_json from "config.json";
import { IGlobalState } from "src/core_renderer/store";

export interface IIndexProps extends IGlobalState {}

@inject("state_theme")
@observer
export class Index extends React.Component<IIndexProps> {
  static defaultProps: IIndexProps = {
    state_theme: undefined,
  };

  private renderTitle = () => {
    return os.platform() !== "darwin" ? null : (
      <Style>
        {`
          .titlebar {
            -webkit-app-region: drag;
            -webkit-user-select: none;
          }
        `}

        <div
          className="titlebar"
          style={{
            width: "100%",
            height: "22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: 300,
            userSelect: "none",
          }}
        >
          {config_json.title}
        </div>
      </Style>
    );
  };

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          userSelect: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          // electronのバグ?
          // flex column のとき flex 1 の要素があるとき
          // height 100% の要素からはみ出てスクロールバーが表示されるのを回避する
          paddingBottom: "3px",
        }}
      >
        {this.renderTitle()}

        <div
          style={{
            flex: 1,
            width: "100%",
            marginTop: "2px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <div>content</div>
        </div>
      </div>
    );
  }
}

