// src/core_renderer/entry/index.tsx

import "src/assets/sass/main.scss";
import React from "react";
import { render } from "react-dom";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import store from "src/core_renderer/store";
import { Main } from "src/core_renderer/component/main";

configure({
  enforceActions: "always",
});

const node = document.createElement("main");
document.body.appendChild(node);

// sync rendering
render(
  <Provider {...store}>
    <Main />
  </Provider>,
  node
);

/*
// async rendering
const AsyncMode = React.unstable_AsyncMode;
render(
  <AsyncMode>
    <Provider {...stores} >
      <Main />
    </Provider>
  </AsyncMode>,
  node
);
*/

