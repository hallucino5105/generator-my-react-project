// src/common/debug/index.ts

import { sprintf } from "sprintf-js";
import { globalStore } from "src/core_renderer/store";

export const dlog = (fmt: string, ...args: any) => {
  if (globalStore.stateGlobalConfig.config?.debug?.enable ?? false) {
    console.log(sprintf(fmt, args));
  }
};

