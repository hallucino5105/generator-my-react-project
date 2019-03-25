// src/electron/index.ts

"use strict";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;


import url from "url";

import {app, BrowserWindow, globalShortcut, ipcMain} from "electron";
import ElectronDebug from "electron-debug";
import _ from "lodash";

import myutil from "src/common/myutil";
import IPCKeys from "src/common/ipc/ipckeys";
import AppMenu from "./menu";
import AppTray from "./tray";
import WindowManager from "./window_manager";
import WindowMain from "./window/main"


if(myutil.isDev()) {
  ElectronDebug({
    showDevTools: false,
  });
}


class Entry {
  constructor() {
    this.wins = {};
    this.menu = null;
    this.force_quit = false;

    this.setEventHandler();
  }

  setEventHandler() {
    ipcMain.on(IPCKeys.hotkey.SetGlobalHotkey, this.onSetGlobalHotkey.bind(this));
  }

  createWindow() {
    WindowManager.initialize(this);

    this.wins = {
      main: WindowMain.createWindow(),
    };

    if(_.filter(this.wins, win => !win).length > 0) {
      throw Error("Window creation did not end normally.");
    }
  }

  createMenu() {
    if(process.platform !== "darwin") return;

    AppMenu.create({
      quit: this.shutdown.bind(this),
    });
  }

  createTray() {
    AppTray.create({
      quit: this.shutdown.bind(this),
    });
  }

  prepare() {
    this.createWindow();
    this.createMenu();
    //this.createTray();
  }

  release() {
    if(process.platform === "darwin") return;
    this.shutdown();
  }

  shutdown() {
    console.log("shutdown application");

    globalShortcut.unregisterAll();
    app.quit();
  }

  onSetGlobalHotkey(e, arg) {
    e.returnValue = this.createHotkey(arg);
  }

  run() {
    if(!myutil.isDev()) {
      const instance_lock = app.requestSingleInstanceLock();
      if(!instance_lock) {
        this.shutdown();
      }
    }

    app.on("ready", () => {
      this.prepare();
    });

    app.on("activate", () => {
      if(this.wins.main === null) {
        this.prepare();
      }
    });

    app.on("before-quit", () => {
      this.force_quit = true;
    });

    app.on("window-all-closed", () => {
      this.release();
    });
  }
}


new Entry().run();

