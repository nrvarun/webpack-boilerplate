const merge = require("webpack-merge");
const baseConfig = require("./webpack.common");

const address = require("ip").address;
const { PORT } = require("./const");

// Plugins
const WebpackMessages = require("webpack-messages");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(baseConfig, {
  mode: "development",
  output: {
    publicPath: `http://${address()}:${PORT}/`,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: "css-hot-loader" },
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackMessages({
      name: "development",
      logger: (str) => {
        console.log(`${str}`);
      },
    }),
  ],
  devtool: "eval-source-map",
  devServer: {
    compress: true,
    quiet: true,
    stats: {
      assets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      entrypoints: false,
      hash: false,
      modules: false,
      timings: false,
      version: false,
    },
    hot: true,
    lazy: false,
    host: address(),
    port: PORT,
    clientLogLevel: "error",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
