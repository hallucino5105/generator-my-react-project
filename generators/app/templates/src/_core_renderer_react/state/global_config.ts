// src/core_renderer/state/global_config.ts

import { observable, action } from "mobx";

import config_init from "config_init.yaml";
import config_common from "config_common.yaml";

export interface IStateGlobalConfig {
  config: any;

  updateGlobalConfig: (config: any) => void;
}

export class StateGlobalConfig {
  @observable.deep config: any = {
    ...config_init,
    ...config_common,
  };

  @action
  updateGlobalConfig = (config: any = {}) => {
    this.config = {
      ...this.config,
      ...config,
    };
  };
}

