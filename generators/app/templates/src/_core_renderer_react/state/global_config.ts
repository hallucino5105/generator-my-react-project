// src/core_renderer/state/global_config.ts

import { observable, action, makeObservable } from "mobx";
import config_init from "config_init.yaml";
import config_common from "config_common.yaml";

export interface IStateGlobalConfig {
  config: any;
  updateGlobalConfig: (config: any) => void;
}

export class StateGlobalConfig {
  config: any = {
    ...config_init,
    ...config_common,
  };

  constructor() {
    makeObservable<StateGlobalConfig>(this, {
      config: observable,
      updateGlobalConfig: action,
    });
  }

  updateGlobalConfig = (config: any = {}) => {
    this.config = {
      ...this.config,
      ...config,
    };
  };
}

