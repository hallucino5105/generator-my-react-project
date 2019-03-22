// src/electron/menu/index.jsx

import {app, Menu} from "electron";


class AppMenu {
  create(handler={}) {
    this.handler = handler;

    this.context_menu = Menu.buildFromTemplate([{
      label: "Application",
      submenu: [
        { label: "About", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: () => {
          if(this.handler.quit) {
            this.handler.quit.call();
          }
        }},
      ],
    }, {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    }]);

    Menu.setApplicationMenu(this.context_menu);
  }
}


export default new AppMenu();

