// src/assets/theme/default.ts

import { IThemeBody } from "src/core_renderer/state/theme";

const theme: IThemeBody = {
  default: {
    initial_theme_label: "default_color",

    font_family: "NotoSansJP, Roboto, 'M+ 1p', YuGothic, Verdana, Meiryo, -apple-system, 'Helvetica Neue', monospace, sans-serif",
    font_family_title: "Roboto, NotoSansJP, 'M+ 1p', YuGothic, Verdana, Meiryo, -apple-system, 'Helvetica Neue', monospace, sans-serif",
    font_weight: 300,

    about: {
      title: {
        font_weight: "bold",
      },
    },
  },

  default_color: {
    fg: "#111",
    bg: "#fff",

    about: {
      fg: "#111",
      bg: "#eee",
    },
  },
};


export default theme;

