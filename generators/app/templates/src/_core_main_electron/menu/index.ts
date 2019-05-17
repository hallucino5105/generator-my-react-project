// src/core_main/menu/index.ts

import {app, Menu} from "electron";

import WindowAbout from "src/core_main/window/about";


interface HandlerType {
  quit?: () => void,
}


class AppMenu {
  handler!: HandlerType;
  context_menu!: Menu;

  create(handler={}) {
    this.handler = handler;

    const template: Electron.MenuItemConstructorOptions[] = [{
      label: "Application",
      submenu: [
        { label: "About", click: () => {
          WindowAbout.show();
        }},
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: () => {
          if(this.handler.quit) {
            this.handler.quit();
          }
        }},
      ],
    }, {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
        // Role "selectAll" is deleted in electron v5
        //{ label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectAll" }
      ]
    }];

    this.context_menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(this.context_menu);
  }
}


export default new AppMenu();

