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
  store_version: number,
  window: {
    size: {
      search: {
        main: SizeType,
        subpanel: SizeType,
      },
      app_config: {
        main: SizeType,
      },
      about: {
        main: SizeType,
      },
    },
    position: PositionType,
  },
  general: {
    call_hotkey: {
			modifier: string[],
			main: string,
			accelerator: string,
    },
    keep_window_focus_out: boolean,
    enable_drag_search_window: boolean,
    auto_launch: boolean,
  },
}


const data: AppConfigType = {
  store_version: 27,

  window: {
    size: {
      search: {
        main: {
          width: 600,
          height: 65
        },
        subpanel: {
          width: 600,
          height: 60,
        },
      },
      app_config: {
        main: {
          width: 650,
          height: 400,
        },
      },
      about: {
        main: {
          width: 400,
          height: 450,
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

