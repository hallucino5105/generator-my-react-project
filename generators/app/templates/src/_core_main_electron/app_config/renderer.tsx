// src/core_main/app_config/renderer.tsx

import React from "react";
import { remote, ipcRenderer } from "electron";

import { uuid } from "src/common/myutil";             
import { isMainProcess } from "src/common/myutil/electron";
import IPCKeys from "src/core_main/ipc/keys";
import {
  ChangeValueHandlerType,
  IPCReplyGetValueType,
  IPCReplySetValueType,
} from ".";


class AppConfigRenderer {
  change_value_handler: Map<string, ChangeValueHandlerType>;
  uid: string;

  constructor() {
    this.change_value_handler = new Map();
    this.uid = uuid();

    this.checkRendererProcess();
  }

  private checkRendererProcess() {
    if(isMainProcess()){
      throw new Error("Do not allow access other than renderer process.");
    }
  }

  get(key: string | null = null, callback?: (value: any) => void) {
    this.checkRendererProcess();

    const oid = uuid();
    const handler = (e: Event, reply: IPCReplyGetValueType) => {
      if(oid !== reply.oid) return;
      if(callback) callback(reply.value);
      ipcRenderer.removeListener(IPCKeys.app_config.ReplyGetValue, handler);
    };

    ipcRenderer.send(IPCKeys.app_config.RequestGetValue, { oid, key });
    ipcRenderer.on(IPCKeys.app_config.ReplyGetValue, handler);
  }

  getSync(key: string | null = null) {
    this.checkRendererProcess();
    return ipcRenderer.sendSync(IPCKeys.app_config.GetValue, key);
  }

  set(key: string, value: any, callback?: (value: any) => void) {
    this.checkRendererProcess();

    const oid = uuid();
    const handler = (e: Event, reply: IPCReplySetValueType) => {
      if(oid !== reply.oid) return;
      if(callback) callback(reply.result);
      ipcRenderer.removeListener(IPCKeys.app_config.ReplySetValue, handler);
    };

    ipcRenderer.send(IPCKeys.app_config.RequestSetValue, key, value);
    if(callback) ipcRenderer.on(IPCKeys.app_config.ReplySetValue, handler);
  }

  setSync(key: string, value: any) {
    this.checkRendererProcess();
    return ipcRenderer.sendSync(IPCKeys.app_config.SetValue, key, value);
  }

  addEventChangeValue(handler: ChangeValueHandlerType) {
    this.checkRendererProcess();

    const win = remote.getCurrentWindow();
    const handler_uid = uuid();

    ipcRenderer.on(IPCKeys.app_config.FireEventChangeValue, handler);
    this.change_value_handler.set(handler_uid, handler);

    ipcRenderer.send(IPCKeys.app_config.AddEventChangeValue, {
      renderer_id: win.id,
      uid: handler_uid,
    });
  }

  clearEventChangeValue() {
    this.checkRendererProcess();

    ipcRenderer.removeAllListeners(IPCKeys.app_config.FireEventChangeValue);
    this.change_value_handler.clear();
  }
}


const app_config_renderer_instance = new AppConfigRenderer();
export default app_config_renderer_instance;


export const connectAppConfig = <P extends {}>(ChildComponent: React.ComponentClass<P>) => {
  if(!app_config_renderer_instance) {
    throw new Error("Uninitialized application config renderer");
  }

  interface ConnectAppConfigStateType  {
    app_config: any;
  };

  return class extends React.Component<P, ConnectAppConfigStateType> {
    state: ConnectAppConfigStateType = {
      app_config: app_config_renderer_instance.getSync(),
    };

    componentDidMount() {
      app_config_renderer_instance.addEventChangeValue((values: any) => {
        this.setState({ app_config: values });
      });
    }

    componentWillUnmount() {
      app_config_renderer_instance.clearEventChangeValue();
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
