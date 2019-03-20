// src/react/mobx/index.tsx

import state_theme from "src/core_main/state/theme";


const stores = {
  state_theme,
};

declare var window: any;
window.stores = stores;

export default stores;

