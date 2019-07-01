import { DefinePlugin } from 'webpack';
import merge from 'webpack-merge';
import common from './webpack.common';

const prod = merge(common, {
  mode: 'production',
});

export default prod;
