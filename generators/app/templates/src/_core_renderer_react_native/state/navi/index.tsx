// src/core_renderer/state/navi/index.tsx

import _ from "lodash";
import {observable, computed, action} from "mobx";
import {NavigationNavigator, NavigationActions} from "react-navigation";


export interface StateNaviType {
  navigation: NavigationActions;
}


class StateNavi {
  @observable.ref navigation: NavigationActions;

  @computed
  get getNavigation() {
    return this.navigation;
  }

  @action.bound
  setNavigator(navigator: NavigationNavigator) {
    if(navigator) {
      this.navigation = navigator._navigation;
    }
  }
}


export default new StateNavi();

