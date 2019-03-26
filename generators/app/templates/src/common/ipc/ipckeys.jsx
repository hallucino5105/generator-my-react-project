// src/electron/ipckeys.jsx


export default {
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
  },
};

