const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

// Escape path for RegExp
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rootPath = escapeRegex(path.resolve(__dirname, '..'));

const config = {
  watchFolders: [path.resolve(__dirname, '..')],
  resolver: {
    // Block parent node_modules to prevent duplicate React modules
    blockList: exclusionList([
      new RegExp(`${rootPath}/node_modules/react/.*`),
      new RegExp(`${rootPath}/node_modules/react-native/.*`),
      new RegExp(`${rootPath}/node_modules/react-native-svg/.*`),
    ]),
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
    extraNodeModules: {
      // Force metro to use the example-app's React packages to avoid multiple copies
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      'react-native-svg': path.resolve(__dirname, 'node_modules/react-native-svg'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
