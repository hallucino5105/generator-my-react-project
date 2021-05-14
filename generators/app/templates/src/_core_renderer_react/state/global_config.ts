// src/core_renderer/state/global_config.ts

import { observable, action } from "mobx";

import config_values from "config.yaml";

export interface IStateGlobalConfig {
  config: any;

  updateGlobalConfig: (config: any) => void;
}

export class StateGlobalConfig {
  @observable.deep config: any = config_values;

  @action
  updateGlobalConfig = (config: any = {}) => {
    this.config = {
      ...this.config,
      ...config,
    };
  };
}

