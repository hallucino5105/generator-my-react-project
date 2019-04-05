// src/common/app_config/index.tsx

// Application global configration
// 
// This class referenced from both main and renderer process.
// Make instance in main process so that can be referred from renderer via IPC.

import React from "react";

import electron from "electron";
import ElectronStore from "electron-store";

import _ from "lodash";

import myutil from "src/common/myutil";
import IPCKeys from "src/core_main/ipc/keys";
import app_config_default from "./default";


export type ChangeValueHandlerType = (value: any) => void;

export interface EventChangeValueCallFromRendererType {
  kind: "event_change_value_call_from_renderer_type",
  renderer_id: number,
  handler_uid: string,
}


export const isEventChangeValueCallFromRendererType = (value: any): value is EventChangeValueCallFromRendererType => {
  return "kind" in value && value.kind === "event_change_value_call_from_renderer_type";
};


class AppConfig {
  static _instance: AppConfig | null = null;

  store!: ElectronStore;
  change_value_handler: Map<string, ChangeValueHandlerType | EventChangeValueCallFromRendererType>;
  initialized: boolean;
  initialized_lazy: boolean;
  uid: string;

  static checkMainProcess() {
    if(process.type !== "browser") {
      throw new Error("Do not allow access other than main process.");
    }
  }

  static getInstance() {
    AppConfig.checkMainProcess();

    if(!AppConfig._instance) {
      AppConfig._instance = new AppConfig();
    }

    return AppConfig._instance;
  }

  constructor() {
    this.change_value_handler = new Map();
    this.initialized = false;
    this.initialized_lazy = false;
    this.uid = myutil.uuid();
  }

  initialize() {
    if(this.initialized) return;

    this.checkMainProcess();
    this.initializeStore();

    myutil.dlog("app conifg uid:", this.uid);
    myutil.dlog("store path:", this.store.path);

    this.initialized = true;
  }

  initializeLazy() {
    if(this.initialized_lazy) return;

    this.checkMainProcess();
    this.initializeIPC();

    this.initialized_lazy = true;
  }

  initializeStore() {
    this.store = new ElectronStore();

    if(this.store.size === 0) {
      this.store.set(app_config_default);
      myutil.dlog("load default store values");
    } else {
      const old_store_version = parseInt(this.store.get("store_version"));
      const new_store_version = app_config_default.store_version;

      if(_.isNil(old_store_version) || _.isNil(new_store_version)) {
        console.warn("Undefined store version");
        console.warn("Forcibly load the default value");
        this.store.set(app_config_default);
      } else {
        if(old_store_version < new_store_version) {
          const old_store = _.cloneDeep(this.store.store);
          const new_store = _.merge({}, old_store, app_config_default);

          new_store.store_version = new_store_version;

          this.store.clear();
          this.store.set(new_store);

          myutil.dlog(`store version has been updated: old ${old_store_version}, new ${new_store_version}`);

          const old_keys = myutil.deepKeys(this.store.store);
          const new_keys = myutil.deepKeys(app_config_default);
          const delete_keys = _.difference(old_keys, new_keys);

          for(const delete_key of delete_keys) {
            this.store.delete(delete_key);
            myutil.dlog(`Delete the keys that remained in the old settings. key=\"${delete_key}\"`);
          }
        }
      }
    }
  }

  initializeIPC() {
    const ipcMain = require("electron").ipcMain;

    ipcMain.on(IPCKeys.app_config.GetValue, (e: any, key: string | null = null) => {
      e.returnValue = this.get(key);
    });

    ipcMain.on(IPCKeys.app_config.SetValue, (e: any, key: string, value: any) => {
      e.returnValue = this.set(key, value);
    });

    ipcMain.on(IPCKeys.app_config.RequestGetValue, (e: any, key: string | null = null) => {
      const ret = this.get(key);
      e.sender.send(IPCKeys.app_config.ResponseGetValue, ret);
    });

    ipcMain.on(IPCKeys.app_config.RequestSetValue, (e: any, key: string, value: any) => {
      const ret = this.set(key, value);
      e.sender.send(IPCKeys.app_config.ResponseSetValue, ret);
    });

    ipcMain.on(IPCKeys.app_config.AddEventChangeValue, (e: any, handler: EventChangeValueCallFromRendererType) => {
      e.returnValue = this.addEventChangeValue(handler);
    });
  }

  checkAll() {
    this.checkMainProcess();
    this.checkInitialized();
  }

  checkMainProcess() {
    AppConfig.checkMainProcess();
  }

  checkInitialized() {
    if(!this.initialized) {
      throw new Error("Uninitialized app config");
    }
  }

  checkInitializedLazy() {
    if(!this.initialized_lazy) {
      throw new Error("Uninitialized lazy app config");
    }
  }

  get(key: string | null = null): any {
    this.checkAll();

    return !key
      ? this.store.store
      : this.store.get(key);
  }

  set(key: string, value: any): object {
    this.checkAll();

    this.store.set(key, value);

    for(const [key, value] of this.change_value_handler.entries()) {
      if(isEventChangeValueCallFromRendererType(value)) {
        const renderer_id = (value as EventChangeValueCallFromRendererType).renderer_id;
        const renderer = electron.webContents.fromId(renderer_id);
        renderer.send(IPCKeys.app_config.FireEventChangeValue, this.store.store);
      } else {
        (value as ChangeValueHandlerType)(this.store.store);
      }
    }

    return this.store.store;
  }

  // * The main process can register a event handler directly.
  // * Because the renderer process can not pass event handlers (it will be null)
  //   register a uid and call it on the renderer side by message communication.
  //   At that time, the handler of the argument becomes Object {renderer_id, handler_uid}.
  addEventChangeValue(handler: ChangeValueHandlerType | EventChangeValueCallFromRendererType) {
    const handler_uid = isEventChangeValueCallFromRendererType(handler) ? handler.handler_uid : myutil.uuid();
    this.change_value_handler.set(handler_uid, handler);
    return handler_uid;
  }
}


class AppConfigProxy {
  ipc_renderer!: any;
  change_value_handler: Map<string, ChangeValueHandlerType>;
  uid: string;

  static isMainProcess() {
    if(process.type === "browser") return true;
    else if(process.type === "renderer") return false;
    else throw new Error("Unkown process type");
  }

  constructor() {
    this.change_value_handler = new Map();
    this.uid = myutil.uuid();

    if(!AppConfigProxy.isMainProcess()) {
      this.ipc_renderer = require("electron").ipcRenderer;
    }

    myutil.dlog("app config proxy uid:", this.uid);
  }

  initialize() {
    if(AppConfigProxy.isMainProcess()) {
      AppConfig.getInstance().initialize();
    } else {
      throw new Error("This method does not allow calls other than the main process");
    }
  }

  initializeLazy() {
    if(AppConfigProxy.isMainProcess()) {
      AppConfig.getInstance().initializeLazy();
    } else {
      throw new Error("This method does not allow calls other than the main process");
    }
  }

  get(key: string | null = null, callback: any = null) {
    if(AppConfigProxy.isMainProcess()) {
      return this.getSync(key);
    } else {
      // * TODO
      //   If this is the case callbacks will be duplicated and registered each time get is called.
      this.ipc_renderer.send(IPCKeys.app_config.RequestGetValue, key);
      if(callback) this.ipc_renderer.on(IPCKeys.app_config.ResponseGetValue, callback);
    }
  }

  getSync(key: string | null = null) {
    if(AppConfigProxy.isMainProcess()) {
      return AppConfig.getInstance().get(key);
    } else {
      return this.ipc_renderer.sendSync(IPCKeys.app_config.GetValue, key);
    }
  }

  set(key: string, value: any, callback: any = null) {
    if(AppConfigProxy.isMainProcess()) {
      return this.setSync(key, value);
    } else {
      // * TODO
      //   If this is the case callbacks will be duplicated and registered each time set is called.
      this.ipc_renderer.send(IPCKeys.app_config.RequestSetValue, key, value);
      if(callback) this.ipc_renderer.on(IPCKeys.app_config.ResponseSetValue, callback);
    }
  }

  setSync(key: string, value: any) {
    if(AppConfigProxy.isMainProcess()) {
      return AppConfig.getInstance().set(key, value);
    } else {
      return this.ipc_renderer.sendSync(IPCKeys.app_config.SetValue, key, value);
    }
  }

  addEventChangeValue(handler: ChangeValueHandlerType) {
    if(AppConfigProxy.isMainProcess()) {
      return AppConfig.getInstance().addEventChangeValue(handler);
    } else {
      const win = electron.remote.getCurrentWindow();
      const handler_uid = myutil.uuid();

      this.ipc_renderer.on(IPCKeys.app_config.FireEventChangeValue, handler);
      this.change_value_handler.set(handler_uid, handler);

      this.ipc_renderer.send(IPCKeys.app_config.AddEventChangeValue, {
        renderer_id: win.id,
        uid: handler_uid,
      });
    }
  }

  clearEventChangeValue() {
    this.ipc_renderer.removeAllListeners(IPCKeys.app_config.FireEventChangeValue);
    this.change_value_handler.clear();
  }
}


const app_config_proxy_instance = new AppConfigProxy();
export default app_config_proxy_instance;


export const connectAppConfig = <P extends {}>(ChildComponent: React.ComponentClass<P>) => {
  if(!app_config_proxy_instance) {
    throw new Error("Uninitialized application config proxy");
  }

  interface ConnectAppConfigStateType  {
    app_config: any;
  };

  return class extends React.Component<P, ConnectAppConfigStateType> {
    state: ConnectAppConfigStateType = {
      app_config: app_config_proxy_instance.getSync(),
    };
  
    componentDidMount() {
      app_config_proxy_instance.addEventChangeValue((values: any) => {
        this.setState({ app_config: values });
      });
    }
  
    componentWillUnmount() {
      app_config_proxy_instance.clearEventChangeValue();
    }
  
    render() {
      return (
        <ChildComponent
          {...this.props}
          {...this.state}
        />
      );
    }
  }
};

