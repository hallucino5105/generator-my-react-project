// src/core_main/window/about.ts

import AppConfig from "src/core_main/app_config";
import WindowBase from "./_base";


class WindowAbout extends WindowBase {
  window_options: object;

  constructor() {
    super("about_window", "about");

    this.window_options = {
      html: "about.html",
      resizeable: false,
      center: true,
    };
  }

  createWindow() {
    const {width, height} = AppConfig.get("window.size.about.main");

    const win = super.createWindow({ ...this.window_options, width, height });
    win.setMenuBarVisibility(false);

    return win;
  }

  async createWindowAsync() {
    const {width, height} = AppConfig.get("window.size.about.main");

    const win = await super.createWindowAsync({ ...this.window_options, width, height });
    win.setMenuBarVisibility(false);

    return win;
  }
}


export default new WindowAbout();


