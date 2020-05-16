const fs = require("fs");

const merge = require("webpack-merge");
const baseConfig = require("./webpack.common");
const decorativeLines = require("./decorative-lines");
const { randomBetween } = require("./utils");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackMessages = require("webpack-messages");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const path = require("path");

const paths = require("./paths");

const pugTemplates = [];
const srcll = fs.readdirSync(paths.dirSrcPug);
srcll.forEach((s) => s.endsWith(".pug") && pugTemplates.push(s));

module.exports = merge(baseConfig, {
  mode: "production",
  output: {
    publicPath: "./",
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
      name: "production",
      logger: (str) => {
        console.log(
          "\n" + decorativeLines[randomBetween(0, decorativeLines.length - 1)]
        );
        console.log(`${str}`);
      },
    }),
    new BundleAnalyzerPlugin(),
  ],
  devtool: "source-map",
});
