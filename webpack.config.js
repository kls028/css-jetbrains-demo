const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, { mode }) => {
  const isDev = mode === 'development';

  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'assets/[name].[contenthash:8].js',
      clean: true,
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    devServer: {
      static: { directory: path.join(__dirname, '.') },
      port: 8080,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true, importLoaders: 1, },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        inject: 'body',
      }),
      ...(isDev
        ? []
        : [
            new MiniCssExtractPlugin({
              filename: 'assets/[name].[contenthash:8].css',
              ignoreOrder: true,
            }),
          ]),
    ],
  };
};
