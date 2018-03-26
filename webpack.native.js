var path = require('path');

module.exports = {
  entry: {
    './native/index': './src/index.js',
  },
  output: {
    library: 'scformschema',
    libraryTarget: 'umd',
    filename: '[name].js',
  },
  resolve: {
    alias: {
      slider: './slider.native',
      counter: './counter.native',
      photo: './photo.native',
      photos: './photos.native',
      text: './text.native',
      checkbox: './checkbox.native',
      SCForm: './SCForm.native',
      scstyles: path.resolve('./src/scstyles.native.js'),
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
    'react-native-keyboard-aware-scroll-view': 'react-native-keyboard-aware-scroll-view',
  },
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
