// webpack.dll.config.js

const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
//const WebpackNotifierPlugin = require("webpack-notifier");

const __workingdir = `${__dirname}/..`;


<% if (framework_type === "Electron") { %>
const electron_project = true;
<% } else { %>
const electron_project = false;
<% } %>


const __exports = function(env, argv) {
  const prod = argv.mode === "production";
  const build_target = process.env.npm_lifecycle_event;

  const __paths = (() => {
    const p = {
      root : __workingdir,

      src          : path.join(__workingdir, "src"),
      stag         : path.join(__workingdir, "stag"),
      prod         : path.join(__workingdir, "prod"),
      dist         : path.join(__workingdir, "dist"),
      node_modules : path.join(__workingdir, "node_modules"),

      package    : path.join(__workingdir, "package.json"),
      config     : path.join(__workingdir, "config.json"),
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

  const resolve_node = {
    assert: "assert",
    buffer: "buffer",
    console: "console-browserify",
    constants: "constants-browserify",
    crypto: "crypto-browserify",
    domain: "domain-browser",
    events: "events",
    http: "stream-http",
    https: "https-browserify",
    os: "os-browserify/browser",
    path: "path-browserify",
    punycode: "punycode",
    process: "process/browser",
    querystring: "querystring-es3",
    stream: "stream-browserify",
    _stream_duplex: "readable-stream/duplex",
    _stream_passthrough: "readable-stream/passthrough",
    _stream_readable: "readable-stream/readable",
    _stream_transform: "readable-stream/transform",
    _stream_writable: "readable-stream/writable",
    string_decoder: "string_decoder",
    sys: "util",
    timers: "timers-browserify",
    tty: "tty-browserify",
    url: "url",
    util: "util",
    vm: "vm-browserify",
    zlib: "browserify-zlib",
  };

  let common_setting = {
    mode: argv.mode,
    devtool: false,

    <% if (framework_type === "Electron") { %>
    target: "electron-renderer",
    <% } else { %>
    target: "web",
    <% } %>

    entry: {
      vendor: Object.keys(__package.dependencies),
    },

    externals: [
      "react-map-gl",
    ],

    output: {
      path: __paths.output,
      filename: "vendor.dll.js",
      library: "vendor",
      libraryTarget: "umd",
      assetModuleFilename: "assets/[hash][ext]",
    },

    resolve: {
      extensions: [".js", ".jsx", ".json"],
      alias: resolve_node,
      fallback: {
        child_process: false,
        fs: false,
        crypto: false,
        net: false,
        tls: false,
        os: false,
      },
    },

    plugins: [
      new webpack.ProvidePlugin(resolve_node),

      //new WebpackNotifierPlugin({
      //  title: "Webpack dll",
      //  alwaysNotify: true,
      //}),

      new MiniCssExtractPlugin({
        filename: "vendor.css"
      }),

      new webpack.DllPlugin({
        path: __paths.dll_vendor,
        name: "vendor",
      }),
    ],

    module: {
      rules: [{
        test: /\.js/,
        use: [{
          loader: "shebang-loader",
        }],
      }, {
        test: /(\.scss|\.sass|\.css)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {}
        }, {
          loader: "css-loader",
          options: {
            sourceMap: false
          }
        }, {
          loader: "resolve-url-loader",
          options: {
            debug: false,
          },
        }, {
          loader: "sass-loader",
          options: {
            sourceMap: false,
          }
        }],
      }, {
        test: /\.(gif|png|jpg)$/,
        type: "asset/resource",
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
      }, {
        test: /\.(mp4|mkv|mov)$/,
        type: "asset/resource",
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
    common_setting = merge({}, common_setting, {
      plugins: common_setting.plugins.concat([
        new CompressionPlugin({
          test: /\.(js|css)(\?.*)?$/i
        }),
      ]),
    });
  }

  process.env.NODE_ENV = build_target;
  process.env.BABEL_ENV = build_target;

  return common_setting;
};


module.exports = __exports;
