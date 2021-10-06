// src/assets/theme/default.ts

import { IStateThemeBody } from "src/core_renderer/state/theme";

const theme: IStateThemeBody = {
  default: {
    initialThemeLabel: "defaultColor",

    fontFamily: "NotoSansJP, Roboto, 'M+ 1p', YuGothic, Verdana, Meiryo, -apple-system, 'Helvetica Neue', monospace, sans-serif",
    fontFamilyTitle: "Roboto, NotoSansJP, 'M+ 1p', YuGothic, Verdana, Meiryo, -apple-system, 'Helvetica Neue', monospace, sans-serif",
    fontWeight: 300,

    about: {
      title: {
        fontWeight: "bold",
      },
    },
  },

  defaultColor: {
    color: "#111",
    backgroundColor: "#fff",

    about: {
      color: "#111",
      backgroundColor: "#eee",
    },
  },
};


export default theme;

