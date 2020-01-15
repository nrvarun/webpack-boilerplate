const fs = require("fs");
const webpack = require("webpack");

// Plugins
const HtmlWebPackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ImageminPlugin = require("imagemin-webpack-plugin").default;

const path = require("path");

const paths = require("./paths");

const pugTemplates = [];
const srcll = fs.readdirSync(paths.dirSrcPug);
srcll.forEach(s => s.endsWith(".pug") && pugTemplates.push(s));

module.exports = {
  entry: {
    vendor: ["whatwg-fetch"],
    common: [path.join(paths.dirSrcJs, "common")],
    index: ["webpack/hot/only-dev-server", path.join(paths.dirSrcJs, "index")],
    about: [path.join(paths.dirSrcJs, "about")]
  },
  output: {
    path: paths.dirDist,
    filename: "js/[name].js"
  },
  stats: "none",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.pug$/,
        use: [
          { loader: "raw-loader" },
          {
            loader: "pug-html-loader",
            options: {
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["css-hot-loader", MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    ...pugTemplates.map(
      templateName =>
        new HtmlWebPackPlugin({
          inject: true,
          template: `./src/pug/${templateName}`,
          filename: path.join(
            paths.dirDist,
            templateName.replace(".pug", ".html")
          ),
          chunks: ["common", "vendor", templateName.replace(".pug", "")],
          minify: false,
          alwaysWriteToDisk: true
        })
    ),
    new MiniCssExtractPlugin({
      filename: "css/app.css"
    }),
    new CopyWebpackPlugin([
      {
        from: "src/assets",
        to: "assets"
      }
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
      // Make sure that the plugin is after any plugins that add images
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        // Disable during development
        disable: process.env.NODE_ENV !== "production",
        pngquant: {
          quality: "95-100"
        }
      })
    ],
    namedModules: true, // NamedModulesPlugin()
    splitChunks: {
      // CommonsChunkPlugin()
      name: "vendor",
      minChunks: 2,
      maxInitialRequests: 20, // for HTTP2
      maxAsyncRequests: 20, // for HTTP2
      minSize: 40 // for example only: chosen to match 2 modules
      // omit minSize in real use case to use the default of 30kb
    },
    noEmitOnErrors: true, // NoEmitOnErrorsPlugin
    concatenateModules: true // ModuleConcatenationPlugin
  }
};
