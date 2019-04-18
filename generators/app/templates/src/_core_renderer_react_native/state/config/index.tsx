// src/core_renderer/state/config/index.tsx

import _ from "lodash";
import {observable, computed, action} from "mobx";

import config from "../../../../config.json";


class StateConfig {
  @observable _config: any = config;

  @computed
  get config() {
    return this._config;
  }
}


export default new StateConfig();

