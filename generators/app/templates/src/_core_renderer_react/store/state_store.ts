import { createContext } from "react";
import { Selector, useStore, useStoreNonObservable } from "./base";
import { StateGlobalConfig } from "../state/global_config";
import { StateTheme } from "../state/theme";

const stateGlobalConfig = new StateGlobalConfig();
const stateTheme = new StateTheme();

export const stateStore = Object.freeze({
  stateGlobalConfig,
  stateTheme,
});

export const StateStoreContext = createContext<typeof stateStore | null>(null);

// No need to wrap with "observer" but "useObserver" is deprecated
export const useStateStore = <TState extends keyof typeof stateStore, TSelection>(
  state: TState,
  selector: Selector<typeof stateStore[TState], TSelection>,
) => useStore(StateStoreContext, state, selector);

// Wrap the component in "observer" when using
export const useStateStoreNonObservable = <TState extends keyof typeof stateStore>(
  state: TState,
) => useStoreNonObservable(StateStoreContext, state);

