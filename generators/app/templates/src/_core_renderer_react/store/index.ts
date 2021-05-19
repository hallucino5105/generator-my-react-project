// src/core_renderer/store/index.ts

import { StateGlobalConfig, IStateGlobalConfig } from "src/core_renderer/state/global_config";
import { StateTheme, IStateTheme } from "src/core_renderer/state/theme";

export interface IGlobalState {
  stateGlobalConfig?: IStateGlobalConfig;
  stateTheme?: IStateTheme;
}

const stateGlobalConfig = new StateGlobalConfig();
const stateTheme = new StateTheme();

const stores = {
  stateGlobalConfig,
  stateTheme,
};

export default stores;

