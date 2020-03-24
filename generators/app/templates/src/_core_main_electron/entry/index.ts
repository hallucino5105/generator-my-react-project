// src/core_main/entry/index.ts

import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import ElectronDebug from "electron-debug";
import { filter } from "lodash";

import myutil from "src/common/myutil";
import IPCKeys from "src/core_main/ipc/keys";
import AppConfig from "src/core_main/app_config";
import AppMenu from "src/core_main/menu";
import AppTray from "src/core_main/tray";
import WindowManager from "src/core_main/window_manager";
import WindowMain from "src/core_main/window/main";
import WindowAbout from "src/core_main/window/about";


//process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";


if(myutil.isDev()) {
  ElectronDebug({
    showDevTools: false,
  });
}


class Entry {
  wins: { [k: string]: BrowserWindow };
  force_quit: boolean;

  constructor() {
    this.wins = {};
    this.force_quit = false;

    AppConfig.initialize();
    WindowManager.initialize(this);
  }

  async createWindow() {
    this.wins.main = await WindowMain.createWindowAsync();
    this.wins.about = await WindowAbout.createWindowAsync();

    if(filter(this.wins, win => !win).length > 0) {
      throw Error("Window creation did not end normally.");
    }

    AppConfig.initializeLazy();
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


const entry_instance = new Entry();
entry_instance.run();


export default Entry;

