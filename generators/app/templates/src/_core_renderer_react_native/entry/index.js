// src/core_renderer/entry/index.js

import {KeepAwake, registerRootComponent} from "expo";
import App from "../app";

if(__DEV__) {
  KeepAwake.activate();
}

registerRootComponent(App);

