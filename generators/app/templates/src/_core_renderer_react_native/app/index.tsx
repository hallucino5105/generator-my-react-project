// src/core_renderer/app/index.tsx

import React from "react";
import {Provider} from "mobx-react";
import {StyleSheet, Text, View, KeyboardAvoidingView} from "react-native";

import stores from "../store";


interface AppProps {
}

export default class App extends React.Component<AppProps> {
  styles = StyleSheet.create({
    keyboard_avoiding_view: {
      flex: 1,
    },

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
        <KeyboardAvoidingView
          style={this.styles.keyboard_avoiding_view}a
          behavior="padding"
        >
          <View style={this.styles.container}>
            <Text>Open up App.js to start working on your app !</Text>
          </View>
        </KeyboardAvoidingView>
      </Provider>
    );
  }
}

