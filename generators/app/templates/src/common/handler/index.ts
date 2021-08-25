// src/common/handler/index.ts

import { omit } from "lodash";
import { uuid } from "src/common/myutil";

export class Handler<T> {
  handlers: { [handler_id: string]: T } = {};

  add = (handler: T): string => {
    const handler_id = uuid();
    this.handlers[handler_id] = handler;
    return handler_id;
  };

  delete = (handler_id: string) => {
    this.handlers = omit(this.handlers, [handler_id]);
  };
}

