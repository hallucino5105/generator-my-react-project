// src/core_renderer/entry/index.tsx

import "src/assets/sass/main.scss";
import React from "react";
import { render } from "react-dom";
import { configure } from "mobx";
import { store, StoreContext } from "src/core_renderer/store";
import { Main } from "src/core_renderer/component/main";

configure({
  enforceActions: "always",
});

const node = document.createElement("main");
document.body.appendChild(node);

// sync rendering
render(
  <StoreContext.Provider value={store}>
    <Main />
  </StoreContext.Provider>,
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

