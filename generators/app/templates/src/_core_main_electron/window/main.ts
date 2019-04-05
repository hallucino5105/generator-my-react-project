// src/core_main/window/main.ts

import WindowBase from "./_base";


class WindowMain extends WindowBase {
  window_options: object;

  constructor() {
    super("main_window", "main");

    this.window_options = {
      width: 800,
      height: 600,
      html: "main.html",
      resizeable: true,
      center: false,
      hide: false,
    };
  }

  createWindow() {
    return super.createWindow(this.window_options);
  }

  async createWindowAsync() {
    return await super.createWindowAsync(this.window_options);
  }
}


export default new WindowMain();

