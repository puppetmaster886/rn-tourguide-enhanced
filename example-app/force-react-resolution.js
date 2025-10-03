#!/usr/bin/env node

/**
 * Force React resolution script
 * This script ensures that the parent library uses the same React instance as the example app
 */

const fs = require('fs');
const path = require('path');

const exampleAppReactPath = path.join(__dirname, 'node_modules', 'react');
const exampleAppReactDomPath = path.join(
  __dirname,
  'node_modules',
  'react-dom',
);
const parentLibPath = path.join(__dirname, '..');
const parentReactPath = path.join(parentLibPath, 'node_modules', 'react');
const parentReactDomPath = path.join(
  parentLibPath,
  'node_modules',
  'react-dom',
);

// Remove any React in parent library
if (fs.existsSync(parentReactPath)) {
  fs.rmSync(parentReactPath, {recursive: true, force: true});
}

if (fs.existsSync(parentReactDomPath)) {
  fs.rmSync(parentReactDomPath, {recursive: true, force: true});
}

// Create symlinks from example app to parent
if (fs.existsSync(exampleAppReactPath)) {
  fs.symlinkSync(exampleAppReactPath, parentReactPath, 'dir');
}

if (fs.existsSync(exampleAppReactDomPath)) {
  fs.symlinkSync(exampleAppReactDomPath, parentReactDomPath, 'dir');
}

// Also create a package.json in parent node_modules to ensure proper resolution
const parentNodeModules = path.join(parentLibPath, 'node_modules');
if (!fs.existsSync(parentNodeModules)) {
  fs.mkdirSync(parentNodeModules, {recursive: true});
}
