import React from "react";
import { observer } from "mobx-react";
import { useStateStore } from "src/core_renderer/store/state_store";

export const Index = observer(() => {
  const { theme } = useStateStore("StateTheme");

  const renderSampleContent = () => (
    <div>Sample Content</div>
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        userSelect: "none",
        // electronのバグ?
        // flex column のとき flex 1 の要素があるとき
        // height 100% の要素からはみ出てスクロールバーが表示されるのを回避する
        //paddingBottom: "3px",
      }}
    >
      {renderSampleContent()}
    </div>
  );
});

