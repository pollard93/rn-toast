const path = require('path');
const packageJson = require('./package.json');

module.exports = {
  mode: 'production',

  entry: {
    index: path.join(__dirname, 'src/index.tsx'),
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: packageJson.name,
    libraryTarget: 'umd',
    globalObject: 'this',
  },

  // Enable sourcemaps for debugging webpack's output.
  // devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    react: 'react',
    reactDOM: 'react-dom',
    'react-native': 'react-native',
    'react-native-safe-area': 'react-native-safe-area',
  },
};
