// webpack.app.config.js

const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const nodeExternals = require("webpack-node-externals");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const __workingdir = `${__dirname}/..`;


<% if (framework_type === "Electron") { %> 
const electron_project = true;
<% } else { %>
const electron_project = false;
<% } %>


const __exports = (env, argv) => {
  const prod = argv.mode === "production";
  const build_target = process.env.npm_lifecycle_event;

  const __paths = (() => {
    const p = {
      root : __workingdir,

      src            : path.join(__workingdir, "src"),
      stag           : path.join(__workingdir, "stag"),
      prod           : path.join(__workingdir, "prod"),
      dist           : path.join(__workingdir, "dist"),
      node_modules   : path.join(__workingdir, "node_modules"),
      entry_main     : path.join(__workingdir, "src/core_main/entry"),
      entry_renderer : path.join(__workingdir, "src/core_renderer/entry"),

      package  : path.join(__workingdir, "package.json"),
      config   : path.join(__workingdir, "config.json"),
      tsconfig : path.join(__workingdir, "tsconfig.json"),
    };

    const output = (() => {
      if(electron_project) {
        return p.dist;
      } else {
        return prod ? p.prod : p.stag;
      }
    })();

    return Object.assign({}, p, {output}, {
      dll_vendor : path.join(output, "vendor_manifest.json"),
    });
  })();

  const __package = require(__paths.package);
  const __config = require(__paths.config);

  // src/core 直下にある"entry/*.(js|jsx|ts|tsx)"をエントリとする
  const pages = (() => {
    const target_files = fs.readdirSync(__paths.entry_renderer);

    const entry_files = _.compact(_.map(target_files, function(file) {
      const matches = file.match(/(.*)\.((j|t)sx?)/);
      if(matches && matches[1] && matches[2]) {
        return { name: matches[1], ext: matches[2] };
      }
    }));

    return entry_files;
  })();

  const ts_checker_async = (
    (!build_target || build_target.match(/serve.*/)) ||
    (build_target && build_target.match(/watch.*/))
  ) ? false : true;

  const exist_dll_vendor = fs.existsSync(__paths.dll_vendor);

  const generate_entry = (() => {
    let common_setting = {
      cache: true,
      mode: argv.mode,
      devtool: "source-map",

      node: {
        __dirname: false,
        __filename: false,
      },

      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        modules: [
          path.resolve(__paths.root),
          "node_modules",
        ],
      },

      module: {
        rules: [{
          test: /\.(html)$/,
          include: __paths.src,
          exclude: /node_modules/,
          use: [{
            loader: "html-loader",
          }],
        }, {
          test: /\.tsx?$/,
          include: __paths.src,
          exclude: /node_modules/,
          use: [{
            loader: "babel-loader",
          }, {
            loader: "ts-loader",
            options: {
              configFile: __paths.tsconfig,
              experimentalWatchApi: true,
              //transpileOnly: true,
              //logLevel: "info",
            },
          }],
        }, {
          test: /\.jsx?$/,
          include: __paths.src,
          exclude: /node_modules/,
          use: [{
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["@babel/preset-react", ["@babel/preset-env", {
                modules: false,
                useBuiltIns: "usage",
                targets: [
                  ">0.25%",
                  "not ie 11",
                  "not op_mini all"
                ],
              }]],
              plugins: [
                [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
                [ "transform-class-properties" ],
              ],
            },
          }],
        }, {
          test: /(\.scss|\.css)$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [{
              loader: "css-loader",
              options: {
                sourceMap: !prod,
              },
            }, {
              loader: "postcss-loader",
              options: {
                sourceMap: !prod,
                plugins: loader => {
                  return [
                    autoprefixer,
                  ];
                },
              },
            }, {
              loader: "resolve-url-loader",
              options: {
                debug: false,
              },
            }, {
              loader: "sass-loader",
              options: {
                sourceMap: true, // 無条件でtrueにすること
              },
            }],
          }),
        }, {
          test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{
            loader: "file-loader",
            options: {
              mimetype: "application/font-woff",
              name: "[hash].[ext]",
              outputPath: "assets",
              publicPath: "assets",
            },
          }],
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          use: "file-loader",
          use: [{
            loader: "file-loader",
            options: {
              mimetype: "image/svg+xml",
              name: "[hash].[ext]",
              outputPath: "assets",
              publicPath: "assets",
            },
          }],
        }, {
          test: /\.(gif|png|jpg)$/,
          use: "file-loader",
          use: [{
            loader: "file-loader",
            options: {
              name: "[hash].[ext]",
              outputPath: "assets",
              publicPath: "assets",
            },
          }],
        }, {
          test: /\.(mp4|mov)$/,
          use: [{
            loader: "file-loader",
            options: {
              name: "[hash].[ext]",
              outputPath: "assets",
              publicPath: "assets",
            },
          }],
        }, {
          test: /\.(frag|vert|vs|fs|glsl)$/,
          use: [{ 
            loader: "glsl-shader-loader",
            options: {},
          }],
        }],
      },
    };

    const common_plugin = [
      new WebpackNotifierPlugin({
        title: "Webpack app",
        alwaysNotify: true,
      }),

      new ExtractTextPlugin("styles.css"),

      new webpack.ProvidePlugin({
        $: "jquery",
      }),

      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [
            autoprefixer({
              browsers: [
                "> 1%",
                "last 2 versions",
                "ie >= 9",
              ],
            }),
          ],
        },
      }),

      new FilterWarningsPlugin({
        exclude: /Critical dependency: the request of a dependency is an expression/,
      }),

      //new HardSourceWebpackPlugin({
      //  cacheDirectory: `${__paths.root}/.cache/hard-source/[confighash]`,
      //}),

      //new ForkTsCheckerWebpackPlugin({
      //  tsconfig: __paths.tsconfig,
      //  workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
      //  tslint: false,
      //  useTypescriptIncrementalApi: true,
      //  measureCompilationTime: true,
      //}),
    ];

    if(build_target && build_target.match(/analyze.*/)) {
      common_plugin.push(
        new BundleAnalyzerPlugin(),
      );
    }

    if(build_target && build_target.match(/build.*/)) {
      if(!prod) {
        const reactTransform = [];

        reactTransform.push({
          // https://github.com/gaearon/react-transform-hmr
          transform: "react-transform-hmr",
          imports: ["react"],
          locals: ["module"],
        });

        reactTransform.push({
          // https://github.com/gaearon/react-transform-catch-errors
          transform: "react-transform-catch-errors",
          imports: ["react", "redbox-react"],
        });

        for(let i = 0; i < common_setting.module.rules.length; i++) {
          const module_rule = common_setting.module.rules[i].use;
          if(module_rule && module_rule.loader === "babel-loader") {
            module_rule.options.plugins.push([
              "react-transform", { transforms: reactTransform },
            ]);
            break;
          }
        }
      }
      else {
        common_plugin.push(
          new CompressionPlugin({
            test: /\.(js|css)(\?.*)?$/i
          }),
        );
      }
    }

    if(!build_target || build_target.match(/serve.*/)) {
      const proxy_app_addr = `http://${__config.serve.app.host}:${__config.serve.app.port}`;

      common_setting = merge({}, common_setting, {
        devServer: {
          contentBase: __paths.output,
          publicPath: __config.serve.public_path,
          compress: true,
          progress: true,
          disableHostCheck: true,
          historyApiFallback: true,
          host: __config.serve.dev.host,
          port: __config.serve.dev.port,

          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },

          proxy: {
            "/api/*": {
              target: proxy_app_addr,
            },
          },
        },
      });
    }

    return {
      <% if (framework_type === "Electron") { %> 
      electron: () => merge({}, common_setting, {
        target: "electron-main",

        entry: [path.join(__paths.entry_main, "index.ts")],

        output: {
          path: __paths.output,
          filename: "electron.build.js",
        },

        plugins: common_plugin,
      }),
      <% } %> 

      react: page => merge({}, common_setting, {
        <% if (framework_type !== "Electron") { %> 
        target: "web",
        <% } else { %>
        target: "electron-renderer",
        <% } %>

        entry: [path.join(__paths.entry_renderer, `${page.name}.${page.ext}`)],

        output: {
          path: __paths.output,
          publicPath: __config.serve.public_path,
          filename: `${page.name}.build.js`,
        },

        plugins: common_plugin.concat((() => {
          const ret = [];
          const html_template_path = path.join(__paths.entry_renderer, `${page.name}.ejs`);

          if(fs.existsSync(html_template_path)) {
            ret.push(new HtmlWebpackPlugin({
              title: __config.title,
              filename: `${page.name}.html`,
              template: html_template_path,
              minify: false,
              hash: false,
              inject: false,
              exist_dll: exist_dll_vendor,
            }));
          }

          if(exist_dll_vendor) {
            ret.push(new webpack.DllReferencePlugin({
              context: __paths.root,
              manifest: require(__paths.dll_vendor),
            }));
          }

          return ret;
        })()),
      }),
    };
  })();

  process.env.NODE_ENV = build_target;
  process.env.BABEL_ENV = build_target;

  return [
    <% if (framework_type === "Electron") { %> 
    generate_entry.electron(),
    <% } %>
    ..._.map(pages, page => generate_entry.react(page)),
  ];
};


module.exports = __exports;

