// src/core_renderer/app/index.tsx

import {Font, AppLoading} from "expo";
import React from "react";
import {View, Text} from "react-native";
import {Provider} from "mobx-react";
import {createStackNavigator, createAppContainer} from "react-navigation";

import stores from "../store";


interface AppProps {}

export default class App extends React.Component<AppProps> {
  state = {
    loaded: false,
  };

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    this.setState({
      loaded: true,
    });
  }

  render() {
    return !this.state.loaded ? (
      <AppLoading />
    ) : (
      <Provider {...stores}>
        <MainNavigator />
      </Provider>
    );
  }
}


const DummyRootComponent: React.SFC<{}> = props => (
  <View style={{
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  }}>
    <Text>Open up App.js to start working on your app !</Text>
  </View>
);


const MainNavigator = createAppContainer(createStackNavigator({
  AppRoot: {
    screen: DummyRootComponent,
  },
}, {
  initialRouteName: "AppRoot",
  defaultNavigationOptions: {
    header: null,
  },
}));


