// store/middleware/redux_websock_middleware.jsx

import io from "socket.io-client";
import config from "config.json";


//export default function createWebsocketMiddleware(options: object) {}


export const ActionTypes = {
  WEBSOCKET_CONNECTED: "@@redux-websocket/WEBSOCKET_CONNECTED",
  WEBSOCKET_DISCONNECTED: "@@redux-websocket/WEBSOCKET_DISCONNECTED",
  WEBSOCKET_ERROR: "@@redux-websocket/WEBSOCKET_ERROR",
  RECEIVED_WEBSOCKET_DATA: "@@redux-websocket/RECEIVED_WEBSOCKET_DATA",
};


const ws_host = config.serve.app.host;
const ws_port = config.serve.app.port;
const ws_ns = config.serve.app.namespace;

const default_options = {
  enable: true,
  endpoint: `ws://${ws_host}:${ws_port}${ws_ns}`,
};


export const isEnableSocketAction = action => {
  return Boolean(action && action.meta && action.meta.socket) && [
    ActionTypes.WEBSOCKET_CONNECTED,
    ActionTypes.WEBSOCKET_DISCONNECTED,
    ActionTypes.RECEIVED_WEBSOCKET_DATA,
    ActionTypes.WEBSOCKET_ERROR,
  ].indexOf(action.meta.socket) > -1;
};


const createConnectionAction = endpoint => {
  return {
    type: ActionTypes.WEBSOCKET_CONNECTED,
    meta: {websocket: endpoint}
  }
};


const createDisonnectionAction = (endpoint, reason) => {
  return {
    type: ActionTypes.WEBSOCKET_DISCONNECTED,
    meta: {websocket: endpoint, reason: reason}
  }
};


const createErrorAction = (endpoint, error) => {
  return {
    type: ActionTypes.WEBSOCKET_ERROR,
    payload: new Error(error),
    meta: {websocket: endpoint, error: true}
  }
};


const createMessageAction = (endpoint, data) => {
  return {
    type: ActionTypes.RECEIVED_WEBSOCKET_DATA,
    payload: data,
    meta: {websocket: endpoint}
  }
};


export default function createWebsocketMiddleware(options=default_options) {
  options = Object.assign({}, default_options, options);

  const connections = {};
  const default_middleware = store => {
    return next => action => {
      next(action);
    }
  };

  return !options.enable ? default_middleware : store => {
    const setup_socket = endpoint => {
      const socket = io(endpoint, {
        autoConnect: false,
      });

      const connection = {
        endpoint: endpoint,
        socket: socket,
        queue: [],
      };

      connections[endpoint] = connection;
      socket.open();

      socket.on("connect", () => {
        console.log("ws:connect");
        store.dispatch(createConnectionAction(endpoint))
      });

      socket.on("disconnect", reason => {
        console.log("ws:disconnect", reason);
        store.dispatch(createDisonnectionAction(endpoint, reason))
      });

      socket.on("connect_timeout", timeout => {
        console.log("ws:connect_timeout", timeout);
        store.dispatch(createErrorAction(endpoint, timeout))
      });

      socket.on("connect_error", error => {
        console.log("ws:connect_error", error);
        store.dispatch(createErrorAction(endpoint, error))
      });

      socket.on("error", error => {
        console.log("ws:error", error);
        store.dispatch(createErrorAction(endpoint, error))
      });

      socket.on("reconnect_error", error => {
        console.log("ws:reconnect_error", error);
        store.dispatch(createErrorAction(endpoint, error))
      });

      socket.on("reconnect_failed", () => {
        console.log("ws:reconnect_failed");
        store.dispatch(createErrorAction(endpoint, null))
      });

      socket.on("connection_test", data => {
        console.log("ws:connection_test", data);

        const _data = {
          topic: "connection_test",
          ...data,
        };

        store.dispatch(createMessageAction(endpoint, _data))
      });

      return connection;
    };

    const get_connection = endpoint => {
      switch(typeof endpoint) {
        case "string":
          return connections[endpoint]
            ? connections[endpoint]
            : setup_socket(endpoint);
         case "boolean":
           return connections[options.endpoint];
         default:
           return setup_socket(endpoint);
      }
    };

    if(options.endpoint) {
      setup_socket(options.endpoint);
    }

    return next => action => {
      if(!isEnableSocketAction(action)) {
        return next(action);
      }

      const endpoint = action.meta.socket;
      const connection = get_connection(endpoint);

      if(connection === NO_CONNECTION && !options.endpoint) {
        throw new Error(undefined_endpoint_error_message(action))
      }

      if(action.meta.incoming) {
        return next(action);
      } else {
        connection.socket.send(action.payload.message);
      }
    };
  };
};


const undefined_endpoint_error_message = action => {
  return "Whoops! You tried to dispatch an action to a socket instance that"
    + "doesn't exist, as you didn't specify an endpoint in the action itself:"
    + "\n"
    + `${JSON.stringify(action, null, 4)}`
    + "\n"
    + "Or you didn't set the \"defaultEndpoint\" config option when creating yourmiddleware instance.";
};

