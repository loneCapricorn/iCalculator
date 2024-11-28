const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const wpMode = argv.mode ?? 'development';

  return {
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
      open: true,
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
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
      new HtmlWebpackPlugin({
        title: 'iCalculator',
        filename: 'index.html',
        template: 'src/template.html',
      }),
    ],
  };
};
