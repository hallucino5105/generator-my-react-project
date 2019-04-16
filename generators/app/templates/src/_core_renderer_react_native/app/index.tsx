// src/core_renderer/app/index.tsx

import React from "react";
import {Provider} from "mobx-react";
import {StyleSheet, Text, View} from "react-native";

import stores from "src/core_renderer/store";


interface AppProps {
}

export default class App extends React.Component<AppProps> {
  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  render() {
    return (
      <Provider {...stores}>
        <View style={this.styles.container}>
          <Text>Open up App.js to start working on your app !</Text>
        </View>
      </Provider>
    );
  }
}

