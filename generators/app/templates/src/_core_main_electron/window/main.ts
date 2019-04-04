// src/core_main/window/main.ts

import WindowBase from "./_base";


class WindowMain extends WindowBase {
  constructor() {
    super("main_window", "main");
  }

  createWindow() {
    return super.createWindow({
      width: 800,
      height: 600,
      html: "main.html",
      resizeable: true,
      center: false,
      hide: false,
    });
  }
}


export default new WindowMain();

