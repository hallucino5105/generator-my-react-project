// src/common/myutil/index.jsx

import { isPlainObject, padStart } from "lodash-es";

const uuid = () => {
  let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
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

const deepkeys = (obj: object): any[] => {
  return Object.keys(obj)
    .filter(key => isPlainObject((obj as any)[key]))
    .map(key => deepkeys((obj as any)[key]).map(k => `${key}.${k}`))
    .reduce((x, y) => x.concat(y), Object.keys(obj));
};

const timeformat = (seconds: number): string => {
  seconds = parseInt(seconds + "");

  const second = parseInt((seconds % 60) + "");
  seconds = (seconds - second) / 60;
  const minute = parseInt((seconds % 60) + "");
  seconds = (seconds - minute) / 60;
  const hour = parseInt(seconds + "");

  let ret = "";
  if (hour > 0) ret += `${padStart(hour + "", 2, "0")}:`;
  ret += `${padStart(minute + "", 2, "0")}:`;
  ret += `${padStart(second + "", 2, "0")}`;

  return ret;
};

export default {
  uuid,
  deepkeys,
  timeformat
};

