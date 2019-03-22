// src/electron/tray/index.jsx

import {app, Tray, Menu} from "electron";


const rootpath = `${__dirname}/..`;


class AppTray {
  create(handler={}) {
    //this.handler = handler;

    //this.context_menu = Menu.buildFromTemplate([{
    //  label: "Preference",
    //  type: "normal",
    //  click: () => {
    //    if(this.handler.preference) {
    //      this.handler.preference.call();
    //    }
    //  },
    //}, {
    //  label: "Quit",
    //  type: "normal",
    //  click: () => {
    //    if(this.handler.quit) {
    //      this.handler.quit.call();
    //    }
    //  }
    //}]);

    //this.tray = new Tray(`${rootpath}/src/image/flare/flare_20x20.png`);
    //this.tray.setContextMenu(this.context_menu)
  }
}


export default new AppTray();

