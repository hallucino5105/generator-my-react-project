// src/typings/sprintf-js.d.ts

declare module "sprintf-js" {
  export function sprintf(fmt: string, ...args: any): string;
  export function vsprintf(fmt: string, args: any[]): string;
}

