// src/core_renderer/state/config/index.tsx

import _ from "lodash";
import {observable, computed, action} from "mobx";

import config from "../../../../config.json";


export interface StateConfigType {
  _config: any;
}


class StateConfig {
  @observable _config: StateConfigType = config;

  @computed
  get config() {
    return this._config;
  }
}


export default new StateConfig();

