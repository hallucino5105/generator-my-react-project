// src/electron/window/base.jsx

import {ipcMain} from "electron";

import IPCKeys from "src/common/ipc/ipckeys";
import AppConfig from "src/common/app_config";
import WindowManager from "src/electron/window_manager";


export default class WindowBase {
  constructor({window_label, ipc_label}) {
    this.window_label = window_label;
    this.ipc_label = ipc_label;

    this.window_info = null;
    this.visible = false;

    this.setEventHandler();
    this.initMethodBinding();
  }

  initMethodBinding() {
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.hide = this.hide.bind(this);
  }

  setEventHandler() {
    const __setEventHandler = (ipc_name, method_name) => {
      const ipckey = IPCKeys["window"][this.ipc_label][ipc_name];
      const method = this[method_name];
      if(!ipckey || !method) return;
      ipcMain.on(ipckey, method.bind(this));
    };

    __setEventHandler("ShowWindow", "onShowWindow");
    __setEventHandler("CloseWindow", "onCloseWindow");
    __setEventHandler("ToggleWindow", "onToggleWindow");
    __setEventHandler("GetDisplayState", "onGetDisplayState");
  }


  createWindow(options) {
    this.window_info = WindowManager.createNewWindow(this.window_label, {
      width: 800,
      height: 600,
      hide: !this.visiable,
      resizeable: true,
      center: false,
      html: null,
      ...options,
    });

    this.window_info.window.on("show", this.visible = true);
    this.window_info.window.on("close", this.visible = false);
    this.window_info.window.on("hide", this.visible = false);

    return this.window_info;
  }

  show(focus_current_screen=true) {
    if(focus_current_screen) {
      // If you are moving to a different desktop such as a virtual desktop, change the focus and display it.
      // https://github.com/electron/electron/issues/8734
      this.window_info.window.setVisibleOnAllWorkspaces(true);  // put the window on all screens
      this.window_info.window.focus();                          // focus the window up front on the active screen
      this.window_info.window.setVisibleOnAllWorkspaces(false); // disable all screen behavior
    }

    this.window_info.window.show();
    this.window_info.window.send(IPCKeys["window"][this.ipc_label]["ShownWindow"]);
    this.visible = true;
  }

  close() {
    this.window_info.window.hide();
    this.window_info.window.send(IPCKeys["window"][this.ipc_label]["ClosedWindow"]);
    this.visible = false;
  }

  hide() {
  }

  toggle() {
    this.visible ? this.close() : this.show();
  }

  onShowWindow(e, arg) {
    this.show();
  }

  onCloseWindow(e, arg) {
    this.close();
  }

  onToggleWindow(e, arg) {
    this.toggle();
  }

  onGetDisplayState(e, arg) {
    e.returnValue = this.visible;
  }
}

