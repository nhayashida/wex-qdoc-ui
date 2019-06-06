import dotenv from 'dotenv';
import os from 'os';
import path from 'path';
import { Configuration } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { GenerateSW } from 'workbox-webpack-plugin';

dotenv.config();

const common: Configuration = {
  entry: {
    explorer: path.resolve(__dirname, 'src/client/wex/index.tsx'),
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
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
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts.googleapis.com/,
          handler: 'StaleWhileRevalidate',
        },
        {
          urlPattern: /\.woff2$/,
          handler: 'StaleWhileRevalidate',
        },
      ],
    }),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/client/wex/index.html'),
      meta: {
        viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
      },
    }),
  ],
};

export default common;
