// src/core_renderer/component/index.tsx

import React from "react";

export const Index = () => {
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
  );
};

