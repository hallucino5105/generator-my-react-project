// src/common/myutil/index.jsx

import * as _ from "lodash";


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


export default {
  isDev,
  isDebug,
  dlog,
  uuid,
  deepKeys,
}

