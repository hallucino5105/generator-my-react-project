// webpack.app.config.js

const fs = require("fs");
const yaml = require("js-yaml");
const _ = require("lodash");
const path = require("path");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const WebpackNotifierPlugin = require("webpack-notifier");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

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

      package     : path.join(__workingdir, "package.json"),
      tsconfig    : path.join(__workingdir, "tsconfig.json"),
      config_init : path.join(__workingdir, "config_init.yaml"),
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

  const __config_init = (() => {
    const buf = fs.readFileSync(__paths.config_init);
    return yaml.safeLoad(buf);
  })();

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

  const exist_dll_vendor = fs.existsSync(__paths.dll_vendor);

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

  const generate_entry = (() => {
    let common_setting = {
      mode: argv.mode,
      devtool: "source-map",

      cache: {
        type: "filesystem",
        buildDependencies: {
          config: [__filename]
        },
      },

      resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        modules: [
          path.resolve(__paths.root),
          "node_modules",
        ],
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

      module: {
        rules: [{
          test: /\.html$/,
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
              transpileOnly: true,
              happyPackMode: true,
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
              presets: [
                "@babel/preset-react",
                [
                  "@babel/preset-env", {
                    modules: false,
                    useBuiltIns: "usage",
                    targets: [
                      ">0.25%",
                      "not ie 11",
                      "not op_mini all",
                    ],
                  },
                ]
              ],
              plugins: [
                [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
                [ "transform-class-properties" ],
              ],
            },
          }, {
            loader: "shebang-loader",
          }],
        }, {
          test: /(\.scss|\.sass|\.css)$/,
          use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: __config_init.serve.public_path
            }
          }, {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          }, {
            loader: "resolve-url-loader",
            options: {
              sourceMap: true,
              debug: false
            }
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }],
        }, {
          test: /\.ya?ml$/,
          use: [{
            loader: "js-yaml-loader",
          }],
        }, {
          test: /\.(frag|vert|vs|fs|glsl)$/,
          use: [{
            loader: "glsl-shader-loader",
            options: {},
          }],
        }, {
          test: /\.(crt|csr|key|pem)$/,
          use: [{
            loader: "raw-loader",
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
          test: /\.(mp4|mov)$/,
          type: "asset/resource",
        }],
      },
    };

    const common_plugin = [
      new webpack.ProvidePlugin(
        Object.assign(resolve_node, {
          Buffer: ["buffer", "Buffer"],
        })
      ),
    
      new MiniCssExtractPlugin({
        filename: "styles.css"
      }),

      new webpack.ProvidePlugin({
        $: "jquery",
      }),

      new LodashModuleReplacementPlugin({
        collections: true,
        chaining: true
      }),

      new WebpackNotifierPlugin({
        title: "Webpack app",
        alwaysNotify: true,
      }),

      new ForkTsCheckerWebpackPlugin({
        async: true,
      }),
    ];

    if(build_target && build_target.match(/analyze.*/)) {
      common_plugin.push(
        new BundleAnalyzerPlugin(),
      );
    }

    if(build_target && build_target.match(/build.*/) && prod) {
      common_plugin.push(
        new CompressionPlugin({
          test: /\.(js|css)(\?.*)?$/i,
        }),
      );
    }

    if(!build_target || build_target.match(/serve.*/)) {
      const proxy_app_addr = `http://${__config_init.serve.app.host}:${__config_init.serve.app.port}`;
      const proxy_dir = path.join(__config_init.serve.public_path, "/api");

      common_setting = merge({}, common_setting, {
        devServer: {
          host: __config_init.serve.dev.host,
          port: __config_init.serve.dev.port,

          historyApiFallback: true,
          compress: true,
          allowedHosts: "all",

          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },

          static: [{
            directory: __paths.output,
            publicPath: __config_init.serve.public_path,
          }],

          devMiddleware: {
            writeToDisk: true,
            serverSideRender: false,
            stats: {
              builtAt: false,
              children: false,
              modules: false,
              version: false,
            },
          },

          client: {
            overlay: true,
          },

          proxy: [{
            context: [proxy_dir],
            target: proxy_app_addr,
          }],

          onBeforeSetupMiddleware: (devServer) => {
            devServer.app.get(__config_init.serve.public_path, (req, res, next) => {
              console.log(`from ${req.ip} - ${req.method} - ${req.originalUrl}`);
              next();
            });
          },
        },
      });
    }

    return {
      <% if (framework_type === "Electron") { %>
      electron: () => {
        return merge({}, common_setting, {
          target: "electron-main",

          entry: [path.join(__paths.entry_main, "index.ts")],

          output: {
            path: __paths.output,
            filename: "electron.build.js",
          },

          plugins: common_plugin,
        });
      },
      <% } %>

      react: page => {
        return merge({}, common_setting, {
          <% if (framework_type !== "Electron") { %>
          target: "web",
          <% } else { %>
          target: "electron-renderer",
          <% } %>

          entry: [path.join(__paths.entry_renderer, `${page.name}.${page.ext}`)],

          output: {
            path: __paths.output,
            publicPath: __config_init.serve.public_path,
            filename: `${page.name}.build.js`,
            assetModuleFilename: "assets/[hash][ext]",
          },

          plugins: common_plugin.concat((() => {
            const ret = [];
            const html_template_path = path.join(__paths.entry_renderer, `${page.name}.ejs`);

            if(fs.existsSync(html_template_path)) {
              ret.push(new HtmlWebpackPlugin({
                title: __config_init.title,
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
        });
      },
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
