'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');


module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the scrumtrulescent ${chalk.red('generator-my-react-project')} generator!`)
    );

    const done = this.async();

    const prompts_framework = [{
      type: "list",
      name: "framework_type",
      message: "Please select a framework to use.",
      choices: ["React", "React Native", "Electron"],
      default: 0,
    }];

    const prompts_react = [{
      type: "input",
      name: "projname",
      message: "Input project name.",
      default: "TemplateReactWeb",
    }, {
      type: "input",
      name: "defport",
      message: "Input web port.",
      default: "33000",
    }, {
      type: "input",
      name: "defport_app",
      message: "Input application port.",
      default: "33001",
    }];

    const prompts_react_native = [];

    const prompts_electron = [];

    this.prompt(prompts_framework).then(props_first => {
      this.props_first = props_first.framework_type;

      const prompts_second = (() => {
        if(this.props_first === "React") return prompts_react;
        else if(this.props_first === "React Native") return prompts_react_native;
        else if(this.props_first === "Electron") return prompts_electron;
      })();

      this.prompt(prompts_second).then(props_second => {
        this.props_second = props_second;
        done();
      });
    });

    return done;
  }

  writing() {
    this._writing_common();

    if(this.props_first === "React") this._writing_react();
    else if(this.props_first === "React Native") this._writing_react_native();
    else if(this.props_first === "Electron") this._writing_electron();
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

      ["README.md"    , "README.md"    , this.props_second],
      ["VERSION"      , "VERSION"      , this.props_second],
      ["package.json" , "package.json" , this.props_second],
      ["config.json"  , "config.json"  , this.props_second],
    ]);
  }

  _writing_react() {
    this._copy_target([
      ["src/_core_main_react", "src/core_main", null],
    ]);
  }

  _writing_react_native() {
  }

  _writing_electron() {
  }

  install() {
    this.spawnCommand("npm", ["run", "init"]);
  }
};
