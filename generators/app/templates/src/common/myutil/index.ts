// src/common/myutil/index.ts

import { isPlainObject, padStart } from "lodash";

export const uuid = () => {
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

export const deepkeys = (obj: object): any[] => {
  return Object.keys(obj)
    .filter(key => isPlainObject((obj as any)[key]))
    .map(key => deepkeys((obj as any)[key]).map(k => `${key}.${k}`))
    .reduce((x, y) => x.concat(y), Object.keys(obj));
};

export const timeformat = (
  seconds: number,
  options: {
    include_ms: boolean;
    display_ms: boolean;
  } = {
    include_ms: false,
    display_ms: false
  }
): string => {
  seconds = parseInt(seconds + "");

  let ms = 0;
  if (options.include_ms) {
    ms = parseInt((seconds % 1000) + "");
    seconds = (seconds - ms) / 1000;
  }

  const second = parseInt((seconds % 60) + "");
  seconds = (seconds - second) / 60;
  const minute = parseInt((seconds % 60) + "");
  seconds = (seconds - minute) / 60;
  const hour = parseInt(seconds + "");

  let ret = "";
  if (hour > 0) ret += `${padStart(hour + "", 2, "0")}:`;
  ret += `${padStart(minute + "", 2, "0")}:`;
  ret += `${padStart(second + "", 2, "0")}`;

  if (options.include_ms && options.display_ms) {
    ret += `.${padStart(ms + "", 3, "0")}`;
  }

  return ret;
};

export const isNull = (arg: any): arg is null => {
  return arg === null;
};

export const getCurrentTime = (
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  return dayjs().format(format);
};

export const blobToUint8Array = async (blob: Blob): Promise<Uint8Array> => {
  const arraybuf: ArrayBuffer = await blob.arrayBuffer();
  const array: Uint8Array = new Uint8Array(arraybuf);
  return array;
};

export const uint8ArrayToBase64 = (array: Uint8Array): string => {
  return base64js.fromByteArray(array);
};

export const base64ToUint8Array = (b64str: string): Uint8Array => {
  return base64js.toByteArray(b64str);
};

export const sleep = async (timeout_ms: number) => {
  await setTimeout(() => {}, timeout_ms);
};

export default {
  uuid,
  deepkeys,
  timeformat,
  isNull,
  getCurrentTime,
  blobToUint8Array,
  uint8ArrayToBase64,
  base64ToUint8Array,
  sleep
};

