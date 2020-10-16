const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
  mode: 'development',
  entry: "./src/javascripts/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "./javascripts/main.js",
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./stylesheets/main.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/templates/index.html",
      filename: "index.html",
    }),
  ]
}