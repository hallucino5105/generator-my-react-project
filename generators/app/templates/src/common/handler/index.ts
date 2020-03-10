// src/common/handler/index.ts

import _ from "lodash";

import myutil from "src/common/myutil";

export default class Handler<T> {
  handlers: { [handler_id: string]: T } = {};

  add = (handler: T): string => {
    const handler_id = myutil.uuid();
    this.handlers[handler_id] = handler;
    return handler_id;
  };

  delete = (handler_id: string) => {
    this.handlers = _.omit(this.handlers, [handler_id]);
  };
}

