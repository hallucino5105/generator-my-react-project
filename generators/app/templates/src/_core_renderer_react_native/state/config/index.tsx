// src/core_renderer/state/config/index.tsx

import _ from "lodash";
import Immutable from "immutable";
import {observable, computed, action} from "mobx";

import myutil from "../../../common/myutil";
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

