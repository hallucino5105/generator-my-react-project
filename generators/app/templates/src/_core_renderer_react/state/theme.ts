// src/core_renderer/state/theme.ts

import { observable, action } from "mobx";
import _ from "lodash";
import deepmerge from "deepmerge";
import theme_values from "src/assets/theme/default";

export interface IStateThemeBody {
  [key: string]: any;
}

export interface IStateTheme {
  theme: IStateThemeBody;
  current_theme_label: string;
  getThemeList: () => string[];
  updateTheme: (color_label: string) => void;
}

export class StateTheme {
  @observable.deep theme: IStateThemeBody = {};
  @observable.deep current_theme_label: string = "";

  constructor() {
    this.updateTheme(theme_values.default.initial_theme_label);
  }

  getThemeList = (): string[] => {
    return _.filter(_.keys(theme_values), (v) => v !== "default");
  };

  @action
  updateTheme = (color_label: string) => {
    let default_theme = _.find(theme_values, (value: any, key: any) => {
      return key === "default";
    });

    if (!default_theme) {
      default_theme = theme_values[0];
    }

    const current_color = theme_values[color_label];
    const current_theme: object = deepmerge(default_theme, current_color);

    this.theme = current_theme;
    this.current_theme_label = color_label;
  };
}
