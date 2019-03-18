// store/reactotron.tsx

const Reactotron = require("reactotron-react-js").default;
const reactotronRedux = require("reactotron-redux").reactotronRedux;


export default Reactotron
  .configure({name: "ElectronApp"})
  .configure({host: "127.0.0.1"})
  .use(reactotronRedux())
  .connect();

