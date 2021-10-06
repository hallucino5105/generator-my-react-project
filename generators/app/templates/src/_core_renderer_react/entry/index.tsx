import "src/assets/sass/main.scss";

import React, { StrictMode } from "react";
import { render } from "react-dom";
import { configure } from "mobx";
import { stateStore, StateStoreContext } from "src/core_renderer/store/state_store";
import { Main } from "src/core_renderer/component/main";

configure({
  enforceActions: "always",
});

const node = document.createElement("main");
document.body.appendChild(node);

// sync rendering
render(
  <StrictMode>
    <StateStoreContext.Provider value={stateStore}>
      <Main />
    </StateStoreContext.Provider>
  </StrictMode>,
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

