import { observable, action, makeObservable } from "mobx";
import _ from "lodash";
import deepmerge from "deepmerge";
import ThemeValues from "src/assets/theme/default";

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

    this.updateTheme(ThemeValues.default.initialThemeLabel);
  }

  getThemeList = (): string[] => {
    return _.filter(_.keys(ThemeValues), (v) => v !== "default");
  };

  updateTheme = (colorLabel: string) => {
    let defaultTheme = _.find(ThemeValues, (value: any, key: any) => {
      return key === "default";
    });

    if (!defaultTheme) {
      defaultTheme = ThemeValues[0];
    }

    const currentColor = ThemeValues[colorLabel];
    const currentTheme: object = deepmerge(defaultTheme, currentColor);

    this.theme = currentTheme;
    this.currentThemeLabel = colorLabel;
  };
}

