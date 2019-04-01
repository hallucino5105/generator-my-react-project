// src/core_main/window/main.ts

import WindowBase from "./base";


class WindowMain extends WindowBase {
  constructor() {
    super("main_window", "main");
  }

  createWindow() {
    return super.createWindow({
      width: 0,
      height: 0,
      html: "main.html",
      resizeable: true,
      center: false,
      hide: true,
    });
  }
}


export default new WindowMain();

