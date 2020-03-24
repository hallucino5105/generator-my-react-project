// src/core_main/window/indow/base.ts

import {ipcMain, BrowserWindow} from "electron";

import IPCKeys from "src/core_main/ipc/keys";
import WindowManager from "src/core_main/window_manager";

export default class WindowBase {
  window_label: string;
  ipc_label: string;
  visible: boolean;
  window_info!: BrowserWindow;

  constructor(window_label: string, ipc_label: string) {
    this.window_label = window_label;
    this.ipc_label = ipc_label;

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
    const __setEventHandler = (ipc_name: string, method_name: string) => {
      const ipckey = (IPCKeys as any)["window"][this.ipc_label][ipc_name];
      const method = (this as any)[method_name];
      if(!ipckey || !method) return;
      ipcMain.on(ipckey, method.bind(this));
    };

    __setEventHandler("ShowWindow", "onShowWindow");
    __setEventHandler("CloseWindow", "onCloseWindow");
    __setEventHandler("ToggleWindow", "onToggleWindow");
    __setEventHandler("GetDisplayState", "onGetDisplayState");
  }


  createWindow(options: object): BrowserWindow {
    this.window_info = WindowManager.createNewWindow({
      width: 800,
      height: 600,
      hide: !this.visible,
      resizeable: true,
      center: false,
      html: null,
      ...options,
    });

    this.window_info.on("show", () => this.visible = true);
    this.window_info.on("close", () => this.visible = false);
    this.window_info.on("hide", () => this.visible = false);

    return this.window_info;
  }

  createWindowAsync(options: object): Promise<BrowserWindow> {
    return new Promise((resolve, reject) => {
      const win = this.createWindow(options);
      win.webContents.on("did-finish-load", () => {
        resolve(win);
      });
    });
  }

  show(focus_current_screen=true) {
    if(focus_current_screen) {
      // If you are moving to a different desktop such as a virtual desktop, change the focus and display it.
      // https://github.com/electron/electron/issues/8734
      this.window_info.setVisibleOnAllWorkspaces(true);  // put the window on all screens
      this.window_info.focus();                          // focus the window up front on the active screen
      this.window_info.setVisibleOnAllWorkspaces(false); // disable all screen behavior
    }

    this.window_info.show();
    this.window_info.webContents.send((IPCKeys as any)["window"][this.ipc_label]["ShownWindow"]);
    this.visible = true;
  }

  close() {
    this.window_info.hide();
    this.window_info.webContents.send((IPCKeys as any)["window"][this.ipc_label]["ClosedWindow"]);
    this.visible = false;
  }

  hide() {
  }

  toggle() {
    this.visible ? this.close() : this.show();
  }

  onShowWindow(e: Event, arg: any) {
    this.show();
  }

  onCloseWindow(e: Event, arg: any) {
    this.close();
  }

  onToggleWindow(e: Event, arg: any) {
    this.toggle();
  }

  onGetDisplayState(e: Event, arg: any) {
    e.returnValue = this.visible;
  }
}

