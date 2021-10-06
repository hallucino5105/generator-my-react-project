// ref: https://qiita.com/kazuma1989/items/16f68cf835031b03fb61

import { useContext } from "react";
import { useObserver } from "mobx-react";

export type Selector<TStore, TSelection> = (store: TStore) => TSelection;

// usage: const [config] = useStateStore("stateGlobalConfig", (state) => [state.config]);
export const useStore = <TStore, TState extends keyof TStore, TSelection>(
  context: React.Context<TStore | null>,
  state: TState,
  selector: Selector<TStore[TState], TSelection>,
) => {
  const store = useContext<TStore | null>(context);
  if (!store) {
    throw new Error("need to pass a value to the context");
  }
  return useObserver(() => selector(store[state]));
};

// usage: const { config } = useStateStore("stateGlobalConfig");
export const useStoreNonObservable = <TStore, TState extends keyof TStore>(
  context: React.Context<TStore | null>,
  state: TState,
) => {
  const store = useContext<TStore | null>(context);
  if (!store) {
    throw new Error("need to pass a value to the context");
  }
  return store[state];
};


