"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const env = process.env.NODE_ENV;
const useContentHash = false;


module.exports = {
  mode: env,
  entry: "./src/main.tsx",
  devtool: env === "production" ? "source-map" : "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.json"
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/i,
        type: "asset/inline"
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/inline"
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({}),
      new CssMinimizerPlugin()
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins:
    [
      new MiniCssExtractPlugin({
        filename: env === "production" && useContentHash ? "[name].[contenthash].css" : "[name].css"
      }),
      new CopyPlugin({
        patterns: [
          { from: "public/manifest.json" },
          env === "production" ? undefined : {from: "public/preview", to: "preview"}

        ].filter(Boolean)
      })
    ],
  output: {
    filename: env === "production" && useContentHash ? "[name].[contenthash].js" : "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
