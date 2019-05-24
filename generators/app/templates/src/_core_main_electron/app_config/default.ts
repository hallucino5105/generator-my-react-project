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
  store_version: 32,

  window: {
    size: {
      about: {
        main: {
          width: 400,
          height: 500,
        },
      },
    },

    position: {
      x: -99999,
      y: -99999,
    },
  },

  general: {
    auto_launch: false,
  },
};


export default data;

