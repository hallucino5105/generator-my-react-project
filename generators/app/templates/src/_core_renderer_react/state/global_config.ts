// src/core_renderer/state/global_config.ts

import { observable, action } from "mobx";

import config_values from "config.json";

export interface IStateGlobalConfig {
  config: any;
}

export class StateGlobalConfig {
  @observable.deep config: any = config_values;

  @action
  update = (new_config: any = {}) => {
    this.config = {
      ...this.config,
      ...new_config,
    };
  };
}

