import React from "react";
import { css } from "@emotion/css";

export const MainView = () => {
  return (
    <div
      className={css`
        &:hover {
          filter: invert(1);
        }
      `}
       style={{
        width: "100%",
        height: "100%",
      }}
    >
      Sample Content
    </div>
  )
};

