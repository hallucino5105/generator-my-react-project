// src/core_renderer/state/config/index.ts

import _ from "lodash";
import {observable, computed, action} from "mobx";

import config from "../../../../config.json";


export interface StateConfigBodyType {
  [key: string]: any;
}

export interface StateConfigType {
  config: StateConfigBodyType;
}


class StateConfig {
  @observable config: any = config;

  @computed
  get getConfig() {
    return this.config;
  }
}


export default new StateConfig();

