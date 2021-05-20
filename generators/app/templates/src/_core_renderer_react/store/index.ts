// src/core_renderer/store/index.ts

import { createContext, useContext } from "react";
import { StateGlobalConfig } from "src/core_renderer/state/global_config";
import { StateTheme } from "src/core_renderer/state/theme";

const stateGlobalConfig = new StateGlobalConfig();
const stateTheme = new StateTheme();

export const globalStore = Object.freeze({
  stateGlobalConfig,
  stateTheme,
});

export const StoreContext = createContext<typeof globalStore>(globalStore);
export const useStores = () => useContext(StoreContext);
export const useStore = <T extends keyof typeof globalStore>(store: T) => useContext(StoreContext)[store];

