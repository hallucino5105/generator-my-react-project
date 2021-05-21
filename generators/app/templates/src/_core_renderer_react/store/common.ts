// src/core_renderer/store/common.ts

import { useContext } from "react";
import { useObserver } from "mobx-react";

export type Selector<TStore, TSelection> = (store: TStore) => TSelection;

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

