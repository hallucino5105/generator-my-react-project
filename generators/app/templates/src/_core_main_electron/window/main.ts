// src/core_main/window/main.ts

import config from "config.json";
import { getPlatform } from "src/common/myutil/electron";
import WindowBase from "./base";

class WindowMain extends WindowBase {
  window_options: object;

  constructor() {
    super("main_window", "main");

    this.window_options = {
      width: 800,
      height: 600,
      html: "index.html",
      resizeable: true,
      center: false,
      hide: false,
    };

    if (this.platform.os === "darwin") {
      this.window_options = {
        ...this.window_options,
        titleBarStyle: "hidden",
        //trafficLightPosition: {
        //  x: 6,
        //  y: config.window.titlebar.height / 2
        //}
      };
    }
  }

  createWindow() {
    return super.createWindow(this.window_options);
  }

  async createWindowAsync() {
    return await super.createWindowAsync(this.window_options);
  }
}


export default new WindowMain();

