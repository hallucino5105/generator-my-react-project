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

  _writing_common() {
    this.fs.copy(this.templatePath('_gitignore')       , this.destinationPath('.gitignore'));
    this.fs.copy(this.templatePath('_editorconfig')    , this.destinationPath('.editorconfig'));
    this.fs.copy(this.templatePath('_babelrc')         , this.destinationPath('.babelrc'));
    this.fs.copy(this.templatePath('_eslintrc')        , this.destinationPath('.eslintrc'));
    this.fs.copy(this.templatePath('_requirements.txt'), this.destinationPath('.requirements.txt'));
    this.fs.copy(this.templatePath('_tsconfig.json')   , this.destinationPath('.tsconfig.json'));

    this.fs.copy(this.templatePath('backend') , this.destinationPath('backend'));
    this.fs.copy(this.templatePath('src')     , this.destinationPath('src'));
    this.fs.copy(this.templatePath('scripts') , this.destinationPath('scripts'));
    this.fs.copy(this.templatePath('webpack') , this.destinationPath('webpack'));
    this.fs.copy(this.templatePath('misc')    , this.destinationPath('misc'));

    this.fs.copyTpl(this.templatePath('README.md')    , this.destinationPath('README.md')    , this.props_second);
    this.fs.copyTpl(this.templatePath('VERSION')      , this.destinationPath('VERSION')      , this.props_second);
    this.fs.copyTpl(this.templatePath('package.json') , this.destinationPath('package.json') , this.props_second);
    this.fs.copyTpl(this.templatePath('config.json')  , this.destinationPath('config.json')  , this.props_second);
  }

  _writing_react() {
  }

  _writing_react_native() {
  }

  _writing_electron() {
  }

  install() {
    this.spawnCommand("npm", ["run", "init"]);
  }
};
