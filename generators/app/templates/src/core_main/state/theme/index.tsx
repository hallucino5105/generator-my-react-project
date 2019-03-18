// src/core_mainm/state/theme/index.tsx

import * as _ from "lodash";
import {observable, computed, action} from "mobx";

import themes from "src/assets/theme/default";


export interface StateThemeType {
  theme: any;
}


class StateTheme {
  @observable theme: object = StateTheme.getDefaultTheme();

  static getDefaultTheme() {
    let default_theme = _.find(themes, (value, key) => {
      return key === "default";
    });

    if(!default_theme) {
      default_theme = themes[0];
    }

    return default_theme;
  }
}


export default new StateTheme();

