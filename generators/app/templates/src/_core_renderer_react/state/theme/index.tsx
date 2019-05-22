// src/core_renderer/state/theme/index.tsx

import _ from "lodash";
import {observable, computed, action} from "mobx";

import themes from "src/assets/theme/default";


class StateTheme {
  @observable theme: object = StateTheme.getDefaultTheme();

  static getDefaultTheme() {
    let default_theme = _.find(themes, (value:any, key:any) => {
      return key === "default";
    });

    if(!default_theme) {
      default_theme = themes[0];
    }

    return default_theme;
  }
}


export default new StateTheme();

