// src/core_renderer/store/index.ts

import StateTheme, { IStateTheme } from "src/core_renderer/state/theme";

export interface IGlobalState {
  state_theme?: IStateTheme;
}

const state_them = new StateTheme();

const stores = {
  state_theme,
};


export default stores;

