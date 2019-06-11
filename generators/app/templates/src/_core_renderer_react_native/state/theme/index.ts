// src/core_renderer/state/theme/index.ts

import _ from "lodash";
import {observable, computed, action} from "mobx";

import themes from "../../../assets/theme/default";


export interface StateThemeBodyType {
  [key: string]: any;
}


export interface StateThemeType {
  theme: StateThemeBodyType;
}


class StateTheme {
  @observable theme: StateThemeBodyType = StateTheme.getDefaultTheme();

  static getDefaultTheme() {
    let default_theme = _.find(themes, (value:any, key:any) => {
      return key === "default";
    });

    if(!default_theme) {
      default_theme = themes[0];
    }

    return default_theme;
  }

  @computed
  get getTheme() {
    return this.theme;
  }
}


export default new StateTheme();

