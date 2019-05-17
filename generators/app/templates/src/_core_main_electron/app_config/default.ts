// src/common/app_config/default.ts

export interface PositionType {
  x: number,
  y: number,
}

export interface SizeType {
  width: number,
  height: number,
}

export interface AppConfigType {
  [k: string]: any,
}


const data: AppConfigType = {
  store_version: 31,

  window: {
    size: {
      about: {
        main: {
          width: 400,
          height: 400,
        },
      },
    },

    position: {
      x: -99999,
      y: -99999,
    },
  },

  general: {
    call_hotkey: {
			modifier: [
				"shift",
				"cmdorctrl",
			],
			main: "space",
			accelerator: "shift+cmdorctrl+space",
    },

    keep_window_focus_out: false,
    enable_drag_search_window: false,
    auto_launch: false,
  },
};


export default data;

