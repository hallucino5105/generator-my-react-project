// src/common/debug/index.ts

import { sprintf } from "sprintf-js";
import store from "src/core_renderer/store";

export const dlog = (fmt: string, ...args: any) => {
  if (store.state_global_config?.config?.debug?.enable ?? false) {
    console.log(sprintf(fmt, args));
  }
};

