// src/core_renderer/component/index.tsx

import { Observer } from "mobx-react-lite";
import React from "react";

export interface IIndexProps {}

export const Index = (props: IIndexProps) => {
  const renderSampleContent = () => (
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
      <div>Sample Content</div>
    </div>
  );

  return (
    <Observer>
      {() => (
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
          {renderSampleContent()}
        </div>
      )}
    </Observer>
  );
};

