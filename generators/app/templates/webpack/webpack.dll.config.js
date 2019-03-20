// webpack.dll.config.js

const _ = require("lodash");
const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlwebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackNotifierPlugin = require("webpack-notifier");

const __workdirname = `${__dirname}/..`;
const __packagepath = `${__workdirname}/package.json`;
const __configpath = `${__workdirname}/config.json`;

const __package = require(__packagepath);
const __config = require(__configpath);


const __exports = function(env, argv) {
  const paths = {
    root : __workdirname,
    src  : path.join(__workdirname, "src"),
    stag : path.join(__workdirname, "stag"),
    prod : path.join(__workdirname, "prod"),
  };

  const prod = argv.mode === "production";
  const output_dir = prod ? paths.prod : paths.stag;
  const build_target = process.env.npm_lifecycle_event;

  let common_setting = {
    cache: true,
    target: "web",
    mode: argv.mode,
    devtool: "source-map",

    node: {
      fs: "empty",
      child_process: "empty",
      __dirname: false,
      __filename: false,
    },

    entry: {
      vendor: Object.keys(__package.dependencies),
    },

    output: {
      path: output_dir,
      filename: "[name].dll.js",
      library: "[name]_lib",
      libraryTarget: "umd",
    },

    resolve: {
      extensions: [".js", ".jsx", ".json"]
    },

    plugins: [
      new WebpackNotifierPlugin({
        title: "Webpack dll",
        alwaysNotify: true,
      }),

      new ExtractTextPlugin("vendor.css"),

      new webpack.DllPlugin({
        path: path.join(output_dir, "[name]_manifest.json"),
        name: "[name]_lib",
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
    ],

    module: {
      rules: [{
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
              plugins: function(loader) {
                return [
                  autoprefixer,
                ];
              },
            },
          }, {
            loader: "resolve-url-loader",
            options: {
              //root: paths.src,
              //includeRoot: true,
              debug: false,
              absolute: false,
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
        test: /\.(mp4|mkv|mov)$/,
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

  if(build_target && build_target.match(/analyze.*/)) {
    common_setting.plugins.push(
      new BundleAnalyzerPlugin(),
    );
  }

  if(build_target && build_target.match(/build.*/)) {
    if(prod) {
      common_setting = merge({}, common_setting, {
        plugins: common_setting.plugins.concat([
          new CompressionPlugin({
            test: /\.(js|css)(\?.*)?$/i
          }),
        ]),
      });
    }
  }

  process.env.NODE_ENV = build_target;
  process.env.BABEL_ENV = build_target;

  return common_setting;
};


module.exports = __exports;

