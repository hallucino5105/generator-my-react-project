// src/common/app_config/index.ts

// Application global configration
//
// This class referenced from both main and renderer process.
// Make instance in main process so that can be referred from renderer via IPC.

import { ipcMain, webContents } from "electron";
import ElectronStore from "electron-store";

import { isNil, cloneDeep, merge, difference } from "lodash-es";

import myutil from "src/common/myutil";
import IPCKeys from "src/core_main/ipc/keys";
import app_config_default from "./default";

const logger = undefined;

export type ChangeValueHandlerType = (value: any) => void;

export interface EventChangeValueCallFromRendererType {
  kind: "event_change_value_call_from_renderer_type",
  renderer_id: number,
  handler_uid: string,
}

export interface IPCRequestGetValueType {
  oid: string,
  key: string,
}

export interface IPCReplyGetValueType {
  oid: string,
  key: string,
  value: any,
}

export interface IPCRequestSetValueType {
  oid: string,
  key: string,
  value: any,
}

export interface IPCReplySetValueType {
  oid: string,
  key: string,
  value: any,
  result: any,
}


export const isEventChangeValueCallFromRendererType = (value: any): value is EventChangeValueCallFromRendererType => {
  return "kind" in value && value.kind === "event_change_value_call_from_renderer_type";
};


class AppConfig {
  store!: ElectronStore;
  change_value_handler: Map<string, ChangeValueHandlerType | EventChangeValueCallFromRendererType>;
  initialized: boolean;
  initialized_lazy: boolean;
  uid: string;

  constructor() {
    this.change_value_handler = new Map();
    this.initialized = false;
    this.initialized_lazy = false;
    this.uid = myutil.uuid();
  }

  private checkMainProcess() {
    if(!myutil.isMainProcess()) {
      throw new Error("Do not allow access other than main process.");
    }
  }

  initialize() {
    if(this.initialized) return;

    this.checkMainProcess();
    this.initializeStore();

    logger.debug(`store path: ${this.store.path}`);

    this.initialized = true;
  }

  initializeLazy() {
    if(this.initialized_lazy) return;

    this.checkMainProcess();
    this.initializeIPC();

    this.initialized_lazy = true;
  }

  private initializeStore() {
    this.store = new ElectronStore();

    if(this.store.size === 0) {
      this.store.set(app_config_default);
      logger.debug("load default store values");
    } else {
      const old_store_version: number = parseInt(this.store.get("store_version") as string);
      const new_store_version: number = app_config_default.store_version;

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

          logger.debug(`store version has been updated: old ${old_store_version}, new ${new_store_version}`);

          const old_keys = myutil.deepKeys(this.store.store);
          const new_keys = myutil.deepKeys(app_config_default);
          const delete_keys = _.difference(old_keys, new_keys);

          for(const delete_key of delete_keys) {
            this.store.delete(delete_key);
            logger.debug(`Delete the keys that remained in the old settings. key='${delete_key}'`);
          }
        }
      }
    }
  }

  private initializeIPC() {
    ipcMain.on(IPCKeys.app_config.GetValue, (e: any, key: string | null = null) => {
      e.returnValue = this.get(key);
    });

    ipcMain.on(IPCKeys.app_config.SetValue, (e: any, key: string, value: any) => {
      e.returnValue = this.set(key, value);
    });

    ipcMain.on(IPCKeys.app_config.RequestGetValue, (e: any, data: IPCRequestGetValueType) => {
      const ret = this.get(data.key);

      e.sender.send(IPCKeys.app_config.ReplyGetValue, {
        oid: data.oid,
        key: data.key,
        value: ret,
      });
    });

    ipcMain.on(IPCKeys.app_config.RequestSetValue, (e: any, data: IPCRequestSetValueType) => {
      const ret = this.set(data.key, data.value);

      e.sender.send(IPCKeys.app_config.ReplySetValue, {
        oid: data.oid,
        key: data.key,
        value: data.value,
        result: ret,
      });
    });

    ipcMain.on(IPCKeys.app_config.AddEventChangeValue, (e: any, handler: EventChangeValueCallFromRendererType) => {
      e.returnValue = this.addEventChangeValue(handler);
    });
  }

  private checkAll() {
    this.checkMainProcess();
    this.checkInitialized();
  }

  private checkInitialized() {
    if(!this.initialized) {
      throw new Error("Uninitialized app config");
    }
  }

  private checkInitializedLazy() {
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
        const renderer_id = value.renderer_id;
        const renderer = webContents.fromId(renderer_id);
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


export default new AppConfig();
