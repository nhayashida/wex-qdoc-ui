import dotenv from 'dotenv';
import path from 'path';
import { Configuration } from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';

dotenv.config();

const common: Configuration = {
  entry: {
    explorer: path.join(__dirname, 'src/client/explorer/index.tsx'),
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, 'dist/explorer'),
    publicPath: '/explorer',
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(tsx)?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader' }],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src/client/explorer/index.html'),
      meta: {
        viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
      },
    }),
  ],
};

export default common;
