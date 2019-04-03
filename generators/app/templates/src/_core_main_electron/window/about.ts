// src/core_main/window/about.ts

import AppConfig from "src/core_main/app_config";
import WindowBase from "./_base";


class WindowAbout extends WindowBase {
  constructor() {
    super("about_window", "about");
  }

  createWindow() {
    const {width, height} = AppConfig.get("window.size.about.main");

    const ret = super.createWindow({
      width: width,
      height: height,
      html: "about.html",
      resizeable: false,
      center: true,
    });

    this.window_info.setMenuBarVisibility(false);

    return ret;
  }
}


export default new WindowAbout();


