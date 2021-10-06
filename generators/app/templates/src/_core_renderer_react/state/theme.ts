import { observable, action, makeObservable } from "mobx";
import _ from "lodash";
import deepmerge from "deepmerge";
import ThemeValues from "src/assets/theme/default.yaml";

export class StateTheme {
  theme: any = {};
  currentColorLabel: string = "";

  constructor() {
    makeObservable<StateTheme>(this, {
      theme: observable,
      currentColorLabel: observable,
      updateColor: action,
    });

    this.updateColor(ThemeValues.targetColorLabel);
  }

  getThemeList = (): string[] => {
    return _.filter(_.keys(ThemeValues.themes), (v) => v !== "default");
  };

  updateColor = (colorLabel: string) => {
    let theme = _.find(ThemeValues.themes, (value: any, key: any) => {
      return key === "default";
    });

    if (!theme) {
      theme = ThemeValues.themes[0];
    }

    const currentColor = ThemeValues.colors[colorLabel];
    const currentThemeValues: object = deepmerge(theme, currentColor);

    this.theme = currentThemeValues;
    this.currentColorLabel = colorLabel;
  };
}

