// src/core_main/entry/main.tsx

import "src/assets/sass/main.scss";

import * as React from "react";
import {render} from "react-dom";
import {Provider} from "mobx-react";

import stores from "src/core_main/store";
import Main from "src/core_main/component/main";


const node = document.createElement("main");
document.body.appendChild(node);


// sync rendering
render((
  <Provider {...stores} >
    <Main />
  </Provider>
), node);

/*
// async rendering
const AsyncMode = React.unstable_AsyncMode;
render((
  <AsyncMode>
    <Provider {...stores} >
      <Main />
    </Provider>
  </AsyncMode>
), node);
*/

