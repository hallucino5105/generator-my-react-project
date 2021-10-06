import "src/assets/sass/main.scss";

import React, { StrictMode } from "react";
import { render } from "react-dom";
import { configure } from "mobx";
import { globalStore, StoreContext } from "src/core_renderer/store";
import { About } from "src/core_renderer/component/about/about";

configure({
  enforceActions: "always",
});

const node = document.createElement("main");
document.body.appendChild(node);

// sync rendering
render(
  <StrictMode>
    <StoreContext.Provider value={globalStore}>
      <About />
    </StoreContext.Provider>
  </StrictMode>,
  node
);

/*
// async rendering
const AsyncMode = React.unstable_AsyncMode;
render(
  <AsyncMode>
    <Provider {...stores} >
      <About />
    </Provider>
  </AsyncMode>,
  node
);
*/

