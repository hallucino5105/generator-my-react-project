// src/assets/theme/default.ts

import {IThemeBody} from "src/core_renderer/state/theme";


const theme: IThemeBody = {
  default: {
    fg: "#111",
    bg: "#fff",
    font_family: "NotoSansJP, Roboto, 'M+ 1p', YuGothic, Verdana, Meiryo, -apple-system, 'Helvetica Neue', monospace, sans-serif",
    font_family_title: "Roboto, NotoSansJP, 'M+ 1p', YuGothic, Verdana, Meiryo, -apple-system, 'Helvetica Neue', monospace, sans-serif",
    font_weight: 300,

    about: {
      fg: "#111",
      bg: "#eee",

      title: {
        font_weight: "bold",
      },
    },
  },
};


export default theme;

