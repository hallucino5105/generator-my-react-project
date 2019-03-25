// src/core_renderer/store/index.tsx

import state_theme from "src/core_renderer/state/theme";


const stores = {
  state_theme,
};

declare var window: any;
window.stores = stores;

export default stores;

