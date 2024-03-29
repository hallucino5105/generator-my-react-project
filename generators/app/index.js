'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const FRAMEWORKS = ["React", "React Native", "Electron"];
const framework_mapper = (framework, actions) => {
  if(!(actions instanceof Array) || FRAMEWORKS.length !== actions.length) {
    throw new Error("The number of actions is different from the framework.");
  }
  const index = FRAMEWORKS.findIndex(item => framework === item);
  return actions[index];
};

const default_web_port = 33000;
const default_expo_port = 19002;


module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the scrumtrulescent ${chalk.red('generator-my-react-project')} generator!`)
    );

    this.props = [];

    this.props.push(await this.prompt([{
      type: "list",
      name: "framework_type",
      message: "Please select a framework to use.",
      choices: FRAMEWORKS,
      default: 0,
    }, {
      type: "input",
      name: "projname",
      message: "Input project name.",
      default: "MyReactTemplate",
    }]));

    if(this.props[0].framework_type !== "React Native") {
      this.props.push(await this.prompt([{
        type: "input",
        name: "defport",
        message: "Input server port.",
        default: framework_mapper(this.props[0].framework_type, [
          default_web_port,
          null,
          default_web_port,
        ]),
      }]));
    } else {
      this.props.push({ defport: -1 });
    }
    
    this.props.push(await this.prompt([{
      type: "confirm",
      name: "enable_app",
      message: "Enable application server?",
      default: false,
    }]));

    if(this.props[2].enable_app) {
      this.props.push(await this.prompt([{
        type: "input",
        name: "defport_app",
        message: "Input application port.",
        default: framework_mapper(this.props[0].framework_type, [
          default_web_port + 1,
          default_expo_port + 1,
          default_web_port + 1,
        ]),
      }]));
    } else {
      this.props.push({ defport_app: -1 });
    }

    this.props.push(await this.prompt(framework_mapper(this.props[0].framework_type, [
      [],
      [],
      [],
    ])));

    this.props = Object.assign({}, ...this.props);
  }

  writing() {
    this._writing_common();

    framework_mapper(this.props.framework_type, [
      this._writing_react.bind(this),
      this._writing_react_native.bind(this),
      this._writing_electron.bind(this),
    ])();
  }

  _copy_target(targets) {
    for(const t of targets) {
      if(!t[2]) {
        this.fs.copy(this.templatePath(t[0]), this.destinationPath(t[1]));
      } else {
        this.fs.copyTpl(this.templatePath(t[0]), this.destinationPath(t[1]), t[2]);
      }
    }
  }

  _writing_common() {
    this._copy_target([
      ["_gitignore"        , ".gitignore"        , null],
      ["_editorconfig"     , ".editorconfig"     , null],
      ["_babelrc"          , ".babelrc"          , null],
      ["_eslintrc"         , ".eslintrc"         , null],
      ["_prettierrc"       , ".prettierrc"       , null],

      ["tsconfig.json"  , "tsconfig.json"  , null],
      ["jest.config.js" , "jest.config.js" , null],

      ["scripts", "scripts", null],

      ["src/assets"  , "src/assets"  , null],
      ["src/common"  , "src/common"  , null],
      ["src/typings" , "src/typings" , null],

      ["README.md"          , "README.md"          , this.props] ,
      ["VERSION"            , "VERSION"            , this.props] ,
      ["package.json"       , "package.json"       , this.props] ,
      ["config_init.yaml"   , "config_init.yaml"   , this.props] ,
      ["config_common.yaml" , "config_common.yaml" , this.props] ,
    ]);
  }

  _writing_react() {
    this._copy_target([
      ["src/_core_renderer_react/state" , "src/core_renderer/state" , null],
      ["src/_core_renderer_react/store" , "src/core_renderer/store" , null],
      ["src/_core_renderer_react/component/main.tsx"  , "src/core_renderer/component/main.tsx"  , null],
      ["src/_core_renderer_react/component/index/index.tsx" , "src/core_renderer/component/index/index.tsx" , null],
      ["src/_core_renderer_react/component/main_view" , "src/core_renderer/component/main_view" , null],
      ["src/_core_renderer_react/entry/index.tsx" , "src/core_renderer/entry/index.tsx" , null],
      ["src/_core_renderer_react/entry/index.ejs" , "src/core_renderer/entry/index.ejs" , null],

      ["webpack/webpack.app.config.js" , "webpack/webpack.app.config.js" , this.props],
      ["webpack/webpack.dll.config.js" , "webpack/webpack.dll.config.js" , this.props],
    ]);
  }

  _writing_react_native() {
    this._copy_target([
      ["src/_core_renderer_react_native" , "src/core_renderer" , null],

      ["babel.config.js"  , "babel.config.js"  , null],
      ["rn-cli.config.js" , "rn-cli.config.js" , null],
      ["metro.config.js"  , "metro.config.js"  , null],
      ["index.js"         , "index.js"         , null],

      ["app.json" , "app.json" , this.props],
    ]);
  }

  _writing_electron() {
    this._copy_target([
      ["src/_core_main_electron"  , "src/core_main"     , null],
      ["src/_core_renderer_react/state" , "src/core_renderer/state" , null],
      ["src/_core_renderer_react/store" , "src/core_renderer/store" , null],
      ["src/_core_renderer_react/component/main.tsx"  , "src/core_renderer/component/main.tsx"  , null],
      ["src/_core_renderer_react/component/index/index.tsx" , "src/core_renderer/component/index/index.tsx" , null],
      ["src/_core_renderer_react/component/about/about.tsx" , "src/core_renderer/component/about/about.tsx" , null],
      ["src/_core_renderer_react/entry/index.tsx"  , "src/core_renderer/entry/index.tsx"  , null],
      ["src/_core_renderer_react/entry/index.ejs"  , "src/core_renderer/entry/index.ejs"  , null],
      ["src/_core_renderer_react/entry/about.tsx" , "src/core_renderer/entry/about.tsx" , null],
      ["src/_core_renderer_react/entry/about.ejs" , "src/core_renderer/entry/about.ejs" , null],

      ["webpack/webpack.app.config.js" , "webpack/webpack.app.config.js" , this.props],
      ["webpack/webpack.dll.config.js" , "webpack/webpack.dll.config.js" , this.props],

      ["_vscode"     , ".vscode"     , null],
      ["gulpfile.js" , "gulpfile.js" , null],
    ]);
  }

  install() {
    //this.spawnCommand("npm", ["run", "init"]);
  }
};
