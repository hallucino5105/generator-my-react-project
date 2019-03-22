// src/electron/window_manager/index.jsx


import path from "path";
import {app, BrowserWindow} from "electron";

import IPCKeys from "src/common/ipc/ipckeys";


const distpath = `${__dirname}/../dist`;
const DEBUG = true;


class WindowManager {
  initialize(entry_instance) {
    this.windows = new Map();
    this.entry_instance = entry_instance;
    this.initialized = true;
  }

  createNewWindow(options) {
    if(!this.initialized) {
      throw Error("Window manager not initialized.");
    }

    options = Object.assign({}, {
      width: 800,
      height: 600,
      minWidth: null,
      minHeight: null,
      resizeable: false,
      shadow: true,
      hide: false,
      hide_until_loading_complete: false,
      frame: true,
      center: false,
      always_on_top: false,
      html: null,
    }, options);

    if(!options.html) {
      throw Error("A null value of html is not allowed.");
    }

    const win = new BrowserWindow({
      width: options.width,
      height: options.height,
      minWidth: options.minWidth,
      minHeight: options.minHeight,
      resizable: options.resizeable,
      frame: options.frame,
      hasShadow: options.shadow,
    });

    const wid = win.id;

    win.on("close", e => {
      if(process.platform === "darwin") {
        if(!this.entry_instance.force_quit) {
          e.preventDefault();
          win.hide();
        }
      }
    });

    win.on("closed", () => {
      this.closeWindow(wid);
    });

    this.windows.set(wid, win);

    const html_file = options.html;
    const html_path = path.join(distpath, html_file);

    if(options.hide || options.hide_until_loading_complete) {
      win.hide();
    }

    win.loadURL(`file://${html_path}#${wid}`);

    if(options.hide_until_loading_complete) {
      win.webContents.on("did-finish-load", () => {
        win.show();
      });
    }

    if(options.center) {
      win.center();
    }

    if(options.always_on_top) {
      win.setAlwaysOnTop(true);
    }

    return win;
  }

  closeWindow(wid) {
    if(DEBUG) {
      console.log(`window was closed, id=${wid}`);
    }

    this.windows.delete(wid);
    this.notifyUpdateWindowID(wid);
  }

  notifyUpdateWindowID(exclude_wid) {
    const wids = [];
    for(const wid of this.windows.keys()) {
      wids.push(wid);
    }

    for(const [wid, win] of this.windows) {
      if(wid === exclude_wid) continue;
      win.webContents.send(IPCKeys.UpdateWindowID, wids);
    }
  }
}


export default new WindowManager();


