

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function root(__path) {
  return path.join(__dirname, __path);
};

var config = {
  entry: [root('./src/app/index.ts')],
  devtool: 'source-map',
  output: {
    path: root('.'),
    filename: 'index.js',
    library: '@zlux/charts',
    libraryTarget: 'amd',
    umdNamedDefine: true
  },
  externals: [
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/forms',
    'd3'
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          'ts-loader',
          'angular2-template-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: root('./src/app'),
        loader: ExtractTextPlugin.extract({ use: 'css-loader?sourceMap', fallback: 'style-loader' })
      },
      {
        test: /\.css$/,
        include: root('./src/app'),
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    extensions: [".js", ".ts"]
  },
  plugins: [
    new webpack.WatchIgnorePlugin([
      /\.js$/,
      /\.d\.ts$/
    ])
  ]
};

module.exports = config;

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

