// src/core_renderer/entry/about.tsx

import "src/assets/sass/main.scss";

import React from "react";
import { render } from "react-dom";
import { configure } from "mobx";
import { Provider } from "mobx-react";

import { store } from "src/core_renderer/store";
import { About } from "src/core_renderer/component/about/about";


configure({
  enforceActions: "strict",
});

const node = document.createElement("main");
document.body.appendChild(node);


// sync rendering
render((
  <Provider {...store} >
    <About />
  </Provider>
), node);

/*
// async rendering
const AsyncMode = React.unstable_AsyncMode;
render((
  <AsyncMode>
    <Provider {...stores} >
      <About />
    </Provider>
  </AsyncMode>
), node);
*/

