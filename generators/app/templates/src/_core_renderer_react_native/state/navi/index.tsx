// src/core_renderer/state/navi/index.tsx

import _ from "lodash";
import {observable, computed, action} from "mobx";
import {NavigationNavigator, NavigationActions} from "react-navigation";


class StateNavi {
  @observable.ref _navigation: NavigationActions;

  @computed
  get navigation() {
    return this._navigation;
  }

  @action.bound
  setNavigator(navigator: NavigationNavigator) {
    this._navigation = navigator._navigation;
  }
}


export default new StateNavi();

