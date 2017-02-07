const path = require('path');
const prettierPlugin = require('prettier-webpack-plugin');

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'build/assets/'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  plugins: [
    new prettierPlugin({ singleQuote: true, printWidth: 160 })
  ],
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.js$/, loader: 'babel-loader', query: {presets: ['es2015']}}
    ]
  }
};
