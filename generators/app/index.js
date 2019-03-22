'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');


module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the scrumtrulescent ${chalk.red('generator-my-react-project')} generator!`)
    );

    const default_server_port = 33000;

    this.props = [];

    this.props.push(await this.prompt([{
      type: "list",
      name: "framework_type",
      message: "Please select a framework to use.",
      choices: ["React", "React Native", "Electron"],
      default: 0,
    }, {
      type: "input",
      name: "projname",
      message: "Input project name.",
      default: "MyReactTemplate",
    }, {
      type: "input",
      name: "defport",
      message: "Input server port.",
      default: default_server_port,
    }, {
      type: "confirm",
      name: "enable_app",
      message: "Enable application server?",
      default: false,
    }]));

    if(this.props[0].enable_app) {
      this.props.push(await this.prompt([{
        type: "input",
        name: "defport_app",
        message: "Input application port.",
        default: default_server_port + 1,
      }]));
    } else {
      this.props.push({ defport_app: -1 });
    }

    this.props.push(await this.prompt((() => {
      if(this.props[0].framework_type === "React") {
        return [];
      }
      else if(this.props[0].framework_type === "React Native") {
        return [];
      }
      else if(this.props[0].framework_type === "Electron") {
        return [];
      }
    })()));

    this.props = Object.assign({}, ...this.props);
  }

  writing() {
    this._writing_common();

    if(this.props.framework_type === "React") this._writing_react();
    else if(this.props.framework_type === "React Native") this._writing_react_native();
    else if(this.props.framework_type === "Electron") this._writing_electron();
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
      ["_requirements.txt" , ".requirements.txt" , null],

      ["tsconfig.json" , "tsconfig.json" , null],

      ["webpack", "webpack", null],
      ["backend", "backend", null],
      ["scripts", "scripts", null],

      ["src/assets"  , "src/assets"  , null],
      ["src/common"  , "src/common"  , null],
      ["src/typings" , "src/typings" , null],

      ["README.md"    , "README.md"    , this.props],
      ["VERSION"      , "VERSION"      , this.props],
      ["package.json" , "package.json" , this.props],
      ["config.json"  , "config.json"  , this.props],
    ]);
  }

  _writing_react() {
    this._copy_target([
      ["src/_core_main_react", "src/core_main", null],
    ]);
  }

  _writing_react_native() {
    this._copy_target([
      ["src/_core_main_react_native", "src/core_main", null],

      ["babel.config.js", "babel.config.js", null],
      ["rn-cli.config.js", "rn-cli.config.js", null],
      ["metro.config.js", "metro.config.js", null],

      ["app.json", "app.json", this.props],
    ]);
  }

  _writing_electron() {
    this._copy_target([
      ["src/_core_main_electron", "src/core_main", null],
    ]);
  }

  install() {
    this.spawnCommand("npm", ["run", "init"]);
  }
};
