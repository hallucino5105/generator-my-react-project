// src/core_renderer/component/index.tsx

import React from "react";
import { inject, observer } from "mobx-react";
import { IGlobalState } from "src/core_renderer/store";

export interface IIndexProps extends IGlobalState {}

@observer
export class Index extends React.Component<IIndexProps> {
  private renderContent = () => {
    return (
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
        {this.renderContent()}
      </div>
    );
  }
}

