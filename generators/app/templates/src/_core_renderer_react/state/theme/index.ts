// src/core_renderer/state/theme/index.ts

import {observable} from "mobx";
import _ from "lodash";

import theme from "src/assets/theme/default";


export interface StateThemeBodyType {
  [key: string | number]: any;
}

export interface StateThemeType {
  theme: StateThemeBodyType;
}


class StateTheme {
  @observable theme: StateThemeBodyType = StateTheme.getDefaultTheme();

  static getDefaultTheme() {
    let default_theme = _.find(theme, (value: any, key: any) => {
      return key === "default";
    });

    if(!default_theme) {
      default_theme = theme[0];
    }

    return default_theme;
  }
}


export default new StateTheme();

