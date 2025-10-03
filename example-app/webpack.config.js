const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.js$|tsx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'index.web.js'), // Entry to your application
    path.resolve(__dirname, 'App.web.tsx'), // Web-specific App file
    path.resolve(__dirname, '../src'), // Tour guide source
    path.resolve(__dirname, 'node_modules/react-native-uncompiled'),
    path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
    path.resolve(__dirname, 'node_modules/react-native-svg'),
    path.resolve(__dirname, 'node_modules/react-native-leader-line'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      configFile: path.resolve(__dirname, 'babel.config.web.js'),
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

const fontLoaderConfiguration = {
  test: /\.ttf$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
  include: [path.resolve(__dirname, 'node_modules/react-native-vector-icons')],
};

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    entry: {
      app: path.join(appDirectory, 'index.web.js'),
    },
    output: {
      path: path.resolve(appDirectory, 'dist'),
      publicPath: '/rn-tourguide-enhanced/',
      filename: 'bundle.js',
    },
    resolve: {
      alias: {
        'react-native$': 'react-native-web',
        'react-native-svg$': 'react-native-svg-web',
        'react-native-vector-icons/MaterialIcons':
          'react-native-vector-icons/dist/MaterialIcons',
      },
      extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
      modules: [path.resolve(appDirectory, 'node_modules'), 'node_modules'],
    },
    module: {
      rules: [
        babelLoaderConfiguration,
        imageLoaderConfiguration,
        fontLoaderConfiguration,
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html'),
        inject: false,
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 3000,
      open: true,
      historyApiFallback: true,
    },
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : 'source-map',
  };
};