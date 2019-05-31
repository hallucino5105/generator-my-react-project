// src/assets/theme/default.ts

import {ThemesType} from "src/core_renderer/state/theme";


const themes: ThemesType = {
  default: {
    fg: "#111",
    bg: "#fff",
    font_family: "NotoSansJP, Roboto, sans-serif",
    font_family_jp: "'-apple-system', 'Hiragino Kaku Gothic ProN', Meiryo, '游ゴシック', YuGothic, sans-serif",
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


export default themes;

