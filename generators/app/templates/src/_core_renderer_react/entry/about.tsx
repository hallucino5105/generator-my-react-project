// src/core_renderer/entry/about.tsx

import "src/assets/sass/main.scss";

import React from "react";
import {render} from "react-dom";
import {Provider} from "mobx-react";

import stores from "src/core_renderer/store";
import About from "src/core_renderer/component/about";


const node = document.createElement("main");
document.body.appendChild(node);


// sync rendering
render((
  <Provider {...stores} >
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

