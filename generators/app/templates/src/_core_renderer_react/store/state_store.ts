import { createContext } from "react";
import { Selector, useStore, useStoreWithObserver } from "./base";
import { StateGlobalConfig } from "../state/global_config";
import { StateTheme } from "../state/theme";

const stateGlobalConfig = new StateGlobalConfig();
const stateTheme = new StateTheme();

export const StateStore = Object.freeze({
  StateGlobalConfig: stateGlobalConfig,
  StateTheme: stateTheme,
});

export const StateStoreContext = createContext<typeof StateStore | null>(null);

// Wrap the component in "observer" when using
export const useStateStore = <TState extends keyof typeof StateStore>(state: TState) =>
  useStore(StateStoreContext, state);

// No need to wrap with "observer" but "useObserver" is deprecated
export const useStateStoreWithObserver = <TState extends keyof typeof StateStore, TSelection>(
  state: TState,
  selector: Selector<typeof StateStore[TState], TSelection>
) => useStoreWithObserver(StateStoreContext, state, selector);

