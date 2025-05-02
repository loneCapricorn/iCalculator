const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const wpMode = argv.mode ?? 'development';

  const config = {
    mode: wpMode,
    entry: {
      bundle: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true,
    },
    devtool: wpMode === 'development' ? 'source-map' : false,
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      host: 'localhost',
      port: 3000,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: 'public/styles', to: 'styles' }],
      }),
      new HtmlWebpackPlugin({
        title: 'iCalculator',
        favicon: 'public/calculator.svg',
        filename: 'index.html',
        template: 'src/templates/index.html',
      }),
    ],
  };

  return config;
};
