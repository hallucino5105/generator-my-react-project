// src/core_renderer/state/theme.ts

import { observable, action, makeObservable } from "mobx";
import _ from "lodash";
import deepmerge from "deepmerge";
import themeValues from "src/assets/theme/default";

export interface IStateThemeBody {
  [key: string]: any;
}

export class StateTheme {
  theme: IStateThemeBody = {};
  currentThemeLabel: string = "";

  constructor() {
    makeObservable<StateTheme>(this, {
      theme: observable,
      currentThemeLabel: observable,
      updateTheme: action,
    });

    this.updateTheme(themeValues.default.initial_theme_label);
  }

  getThemeList = (): string[] => {
    return _.filter(_.keys(themeValues), (v) => v !== "default");
  };

  updateTheme = (colorLabel: string) => {
    let defaultTheme = _.find(themeValues, (value: any, key: any) => {
      return key === "default";
    });

    if (!defaultTheme) {
      defaultTheme = themeValues[0];
    }

    const currentColor = themeValues[colorLabel];
    const currentTheme: object = deepmerge(defaultTheme, currentColor);

    this.theme = currentTheme;
    this.currentThemeLabel = colorLabel;
  };
}

