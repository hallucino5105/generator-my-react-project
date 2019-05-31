// src/core_renderer/state/theme/index.tsx

import _ from "lodash";
import {observable, computed, action} from "mobx";

import themes from "../../../assets/theme/default";


export interface ThemesType {
  [key: string]: object;
}


class StateTheme {
  @observable _theme: any = StateTheme.getDefaultTheme();

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
  get theme() {
    return this._theme;
  }
}


export default new StateTheme();

