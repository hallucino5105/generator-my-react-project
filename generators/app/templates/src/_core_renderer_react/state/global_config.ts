import { observable, action, makeObservable } from "mobx";
import ConfigInit from "config_init.yaml";
import ConfigCommon from "config_common.yaml";

export class StateGlobalConfig {
  config: any = {
    ...ConfigInit,
    ...ConfigCommon,
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

