// src/core_renderer/app/dummy.tsx

import React from "react";
import {View, Text} from "react-native";


export default class DummyComponent extends React.Component<{}> {
  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text>Open up App.js to start working on your app !</Text>
      </View>
    );
  }
};

