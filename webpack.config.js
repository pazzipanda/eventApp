const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const autoprefixer = require('autoprefixer');

const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, '/app/index.html'),
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  context: path.join(__dirname, '/app'),

  entry: {
    javascript: './js/app.js',
  },

  output: {
    filename: 'app.js',
    path: path.join(__dirname, '/dist'),
  },

  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer({ browsers: '> 3%' })],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },

  plugins: [HTMLWebpackPluginConfig],

};
