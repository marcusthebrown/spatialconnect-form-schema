var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    './web/index': './src/index.js',
  },
  output: {
    library: 'scformschema',
    libraryTarget: 'umd',
    filename: '[name].js',
  },
  resolve: {
    alias: {
      slider: './slider',
      counter: './counter',
      photo: './photo',
      photos: './photos',
      text: './text',
      checkbox: './checkbox',
      SCForm: './SCForm',
      scstyles: path.resolve('./src/scstyles.js'),
      palette: path.resolve('./src/palette.js'),
    },
  },
  externals: {
    react: 'react',
    'react-native': 'react-native',
    'react-native-image-picker': 'react-native-image-picker',
    'react-native-image-crop-picker': 'react-native-image-crop-picker',
    'react-native-image-progress': 'react-native-image-progress',
    'react-native-image-offline': 'react-native-image-offline',
    'react-native-progress': 'react-native-progress',
    'tcomb-form-native': 'tcomb-form-native',
    'tcomb-json-schema': 'tcomb-json-schema',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel',
      },
    ],
  },
};
