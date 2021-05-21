// src/core_renderer/store/index.ts

import { createContext } from "react";
import { StateGlobalConfig } from "src/core_renderer/state/global_config";
import { StateTheme } from "src/core_renderer/state/theme";
import { Selector, useStore } from "./common";

const stateGlobalConfig = new StateGlobalConfig();
const stateTheme = new StateTheme();

export const stateStore = Object.freeze({
  stateGlobalConfig,
  stateTheme,
});

export const StateStoreContext = createContext<typeof stateStore | null>(null);
export const useStateStore = <TState extends keyof typeof stateStore, TSelection>(
  state: TState,
  selector: Selector<typeof stateStore[TState], TSelection>,
) => useStore(StateStoreContext, state, selector);

