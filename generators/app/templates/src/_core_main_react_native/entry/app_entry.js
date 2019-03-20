// src/core_main/entry/app_entry.js

import {KeepAwake, registerRootComponent} from "expo";
import App from "../app";

if(__DEV__) {
  KeepAwake.activate();
}

registerRootComponent(App);

