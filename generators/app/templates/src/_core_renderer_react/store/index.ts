// src/core_renderer/store/index.ts

import StateGlobalConfig, {
  IStateGlobalConfig
} from "src/core_renderer/state/global_config";
import StateTheme, { IStateTheme } from "src/core_renderer/state/theme";

export interface IGlobalState {
  state_global_config?: IStateGlobalConfig;
  state_theme?: IStateTheme;
}

const state_global_config = new StateGlobalConfig();
const state_theme = new StateTheme();

const stores = {
  state_global_config,
  state_theme
};

export default stores;

