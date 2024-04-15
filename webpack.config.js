const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './scr/main.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  devtool: 'source-map',
  plugins:[
    new HTMLPlugin({
      template: 'public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public',
        globOptions: {
          ignore: ['**/index.html'],
        },
      }],
    }),
  ],
  module: {
    rules:[
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
    ],
  },
};
