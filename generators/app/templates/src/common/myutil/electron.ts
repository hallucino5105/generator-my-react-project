/*
import os from "os";
import log4js from "log4js";

export const logger = log4js.getLogger();
logger.level = "debug";

export const getPlatform = () => {
  return {
    os: os.platform(),
    arch: os.arch(),
  };
};

export const isDev = () => {
  return process.env.ELECTRON_ENV === "development";
};

export const isMainProcess = () => {
  if(process.type === "browser") return true;
  else if(process.type === "renderer") return false;
  else throw new Error("Unkown process type");
};

export default {
  logger,
  getPlatform,
  isDev,
  isMainProcess,
}
*/

