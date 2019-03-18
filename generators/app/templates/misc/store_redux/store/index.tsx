// src/react/store/index.tsx

import {applyMiddleware, createStore} from "redux";
import {createLogger} from "redux-logger";

import reducer from "src/react/redux/reducer";


export default function createStoreWithMiddleware() {
  const middleware = applyMiddleware(createLogger());
  return middleware(createStore)(reducer);
};


/*
// with websock & reactron
import {applyMiddleware, createStore} from "redux";
import {createLogger} from "redux-logger";

import myutil from "src/common/myutil";
import reducer from "src/react/reducer";
import Reactotron from "./reactotron";

const createWebsocketMiddleware = require("./middleware/redux_websock_middleware").default;


export default function createStoreWithMiddleware() {
  const middleware = applyMiddleware(
    createLogger(),
    createWebsocketMiddleware({ enable: false }),
  );

  if(myutil.isDev()) {
    return Reactotron.createStore(reducer, middleware);
  } else {
    return middleware(createStore)(reducer);
  }
};
*/

