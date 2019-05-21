// src/electron/ipckeys.jsx

interface IPCKeyType {
  [k: string]: any,
}


const keys: IPCKeyType = {
  window_manager: {
    UpdateWindowID: "@@IPCKeys_WindowManager_UpdateWindowID",
    RequestWindowInfo: "@@IPCKeys_WindowManager_RequestWindowInfo",
    ResponseWindowInfo: "@@IPCKeys_WindowManager_ResponseWindowInfo",
  },

  window: {
    main: {
      ShowWindow: "@@IPCKeys_MainWindow_ShowWindow",
      ShownWindow: "@@IPCKeys_MainWindow_ShownWindow",
      CloseWindow: "@@IPCKeys_MainWindow_CloseWindow",
      ClosedWindow: "@@IPCKeys_MainWindow_ClosedWindow",
      ToggleWindow: "@@IPCKeys_MainWindow_ToggleWindow",
      GetgDisplayState: "@@IPCKeys_MainWindow_GetDisplayState",
    },

    about: {
      ShowWindow: "@@IPCKeys_AboutWindow_ShowWindow",
      ShownWindow: "@@IPCKeys_AboutWindow_ShownWindow",
      CloseWindow: "@@IPCKeys_AboutWindow_CloseWindow",
      ClosedWindow: "@@IPCKeys_AboutWindow_ClosedWindow",
      ToggleWindow: "@@IPCKeys_AboutWindow_ToggleWindow",
      GetgDisplayState: "@@IPCKeys_AboutWindow_GetDisplayState",
    },
  },

  app_config: {
    GetValue: "@@IPCKeys_AppConfig_GetValue",
    SetValue: "@@IPCKeys_AppConfig_SetValue",
    RequestGetValue: "@@IPCKeys_AppConfig_RequestGetValue",
    ResponseGetValue: "@@IPCKeys_AppConfig_ResponseGetValue",
    RequestSetValue: "@@IPCKeys_AppConfig_RequestSetValue",
    ResponseSetValue: "@@IPCKeys_AppConfig_ResponseSetValue",
    AddEventChangeValue: "@@IPCKeys_AppConfig_AddEventChangeValue",
    FireEventChangeValue: "@@IPCKeys_AppConfig_FireEventChangeValue",
  },
};


export default keys;

