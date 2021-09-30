// src/core_renderer/store/index.ts

import { createContext } from "react";
import { Selector, useStore, useStoreWithObserver } from "./common";
import { StateGlobalConfig } from "../state/global_config";
import { StateTheme } from "../state/theme";

const stateGlobalConfig = new StateGlobalConfig();
const stateTheme = new StateTheme();

export const stateStore = Object.freeze({
  stateGlobalConfig,
  stateTheme,
});

export const StateStoreContext = createContext<typeof stateStore | null>(null);

// Wrap the component in "observer" when using
export const useStateStore = <TState extends keyof typeof stateStore>(
  state: TState,
) => useStore(StateStoreContext, state);

// No need to wrap with "observer" but "useObserver" is deprecated
export const useStateStoreWithObserver = <TState extends keyof typeof stateStore, TSelection>(
  state: TState,
  selector: Selector<typeof stateStore[TState], TSelection>,
) => useStoreWithObserver(StateStoreContext, state, selector);

