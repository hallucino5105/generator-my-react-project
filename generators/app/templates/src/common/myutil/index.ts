// src/common/myutil/index.jsx

import os from "os";

import _ from "lodash";
import log4js from "log4js";


export const logger = log4js.getLogger();
logger.level = "debug";


const getPlatform = () => {
  return {
    os: os.platform(),
    arch: os.arch(),
  };
};

const isDev = () => {
  return process.env.ELECTRON_ENV === "development";
};

const isDebug = () => {
  const debug = process.env.DEBUG as string | number | boolean;

  if(_.isString(debug)) {
    const _debug = parseInt(debug);

    if(_.isNaN(_debug)) {
      return debug === "true";
    } else {
      return _debug > 0;
    }
  } else if(_.isInteger(debug)) {
    return debug > 0;
  } else if(_.isBoolean(debug)) {
    return debug;
  } else {
    return false;
  }
};

const isMainProcess=() => {
  if(process.type === "browser") return true;
  else if(process.type === "renderer") return false;
  else throw new Error("Unkown process type");
};

const dlog = (...args: any[]) => {
  if(!isDebug()) return;
  console.log(...args);
};

const uuid = () => {
  let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
  for(let i = 0, len = chars.length; i < len; i++) {
    switch(chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }

  return chars.join("");
};

const deepKeys = (obj: object): any[] => {
  return Object.keys(obj)
    .filter(key => _.isPlainObject((obj as any)[key]))
    .map(key => deepKeys((obj as any)[key]).map(k => `${key}.${k}`))
    .reduce((x, y) => x.concat(y), Object.keys(obj));
};

const timeFormat = (seconds: number): string => {
  seconds = parseInt(seconds+"");

  const second = parseInt((seconds % 60)+"");
  seconds = (seconds - second) / 60;
  const minute = parseInt((seconds % 60)+"");
  seconds = (seconds - minute) / 60;
  const hour = parseInt(seconds+"");

  let ret = "";
  if(hour > 0) ret += `${_.padStart(hour+"", 2, "0")}:`;
  ret += `${_.padStart(minute+"", 2, "0")}:`;
  ret += `${_.padStart(second+"", 2, "0")}`;

  return ret;
};


export default {
  getPlatform,
  isDev,
  isDebug,
  isMainProcess,
  dlog,
  uuid,
  deepKeys,
  timeFormat,
}

