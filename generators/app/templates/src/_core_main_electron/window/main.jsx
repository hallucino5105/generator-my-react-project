// src/electron/window/main.jsx

import WindowBase from "./base";


class WindowMain extends WindowBase {
  constructor() {
    super({
      window_label: "main_window",
      ipc_label: "main",
    });
  }

  createWindow() {
    super.createWindow({
      width: 0,
      height: 0,
      html: "main.html",
      resizeable: true,
      center: false,
      hide: true,
    });

    return this.window_info;
  }
}


export default new WindowMain();

