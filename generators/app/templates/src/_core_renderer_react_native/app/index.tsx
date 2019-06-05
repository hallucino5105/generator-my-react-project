// src/core_renderer/app/index.tsx

import React from "react";
import {Provider} from "mobx-react";
import {createStackNavigator, createAppContainer} from "react-navigation";

import stores from "../store";
import DummyComponent from "../component/dummy";


const MainNavigator = createAppContainer(createStackNavigator({
  AppRoot: {
    screen: DummyComponent,
  },
}, {
  initialRouteName: "AppRoot",
  defaultNavigationOptions: {
    header: null,
  },
}));

const MainNavigatorRefHandler = (navigator: NavigationNavigator) => {
  stores.state_navi.setNavigator(navigator);
};


interface AppProps {}

export default class App extends React.Component<AppProps> {
  render() {
    return (
      <Provider {...stores}>
        <MainNavigator ref={MainNavigatorRefHandler} />
      </Provider>
    );
  }
}

