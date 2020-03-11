// src/core_renderer/state/theme.ts

import {observable} from "mobx";
import {find} from "lodash-es";

import theme_values from "src/assets/theme/default";

export interface IThemeBody {
  [key: string]: any;
}

export interface IStateTheme {
  theme: IThemeBody;
}

export default class StateTheme {
  @observable.deep theme: IThemeBody;

  constructor(config: any) {
    this.theme = this.getDefaultTheme();
  }

  getDefaultTheme = () => {
    let default_theme = find(theme_values, (value: any, key: any) => {
      return key === "default";
    });

    if(!default_theme) {
      default_theme = theme_values[0];
    }

    return default_theme;
  };
}

