# Development Guide

This guide covers how to develop and contribute to the rn-tourguide-enhanced library.

## Prerequisites

- Node.js >= 18 (see `.nvmrc`)
- Yarn package manager
- React Native development environment

## Quick Start

```bash
# Clone and install
git clone https://github.com/puppetmaster886/rn-tourguide-enhanced.git
cd rn-tourguide-enhanced
yarn install

# Build the library
yarn build

# Run tests
yarn test

# Test with the example app
cd example-app
npm install
yarn start --reset-cache --port 8086

# In another terminal
npx react-native run-android --port=8086
```

## Project Structure

```
rn-tourguide-enhanced/
├── src/                    # Library source code (TypeScript)
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript type definitions
│   └── utilities/         # Utility functions
├── lib/                   # Compiled library output (git ignored)
├── example-app/          # React Native test application
└── __tests__/           # Unit tests
```

## Development Workflow

### 1. Making Changes

Edit files in the `src/` directory. The main components are:

- `TourGuideProvider.tsx` - Main provider component
- `TourGuideZone.tsx` - Wrapper for highlighted elements
- `useTourGuideController.tsx` - Main hook for controlling tours
- `types.ts` - TypeScript definitions

### 2. Building

```bash
yarn build
```

This compiles TypeScript files from `src/` to JavaScript in `lib/`.

### 3. Testing

```bash
# Run unit tests
yarn test

# Run with coverage
yarn test --coverage

# Watch mode
yarn test --watch
```

### 4. Linting & Type Checking

```bash
# ESLint
yarn lint
yarn lint --fix

# TypeScript checking
yarn tsc

# All checks at once
yarn verify
```

### 5. Testing with Example App

The example app is configured to import from `../lib`, so:

1. Make changes in `src/`
2. Run `yarn build`
3. Reload the example app (press `r` in Metro)

## Metro Configuration

The example app uses a custom Metro config (`example-app/metro.config.js`) that:

- Watches the parent directory for changes
- Includes aliases to prevent React duplication
- Supports TypeScript files

## React Version Compatibility

The library is built to be compatible with:

- React >= 18.0.0
- React Native >= 0.70.0
- react-native-svg >= 12.0.0

### Avoiding React Hook Issues

To prevent "Invalid hook call" errors:

1. Always import React hooks directly: `import React, { useState } from 'react'`
2. Avoid destructuring from React object: ~~`const { useState } = React`~~
3. Use Metro aliases to ensure single React instance

## Publishing

```bash
# This runs tests, linting, type checking, and builds
yarn verify

# Publish to npm (requires npm login and permissions)
npm publish
```

The `prepublishOnly` script ensures the library is verified before publishing.

## Common Issues

### Module Resolution Errors

If you see "Unable to resolve module" errors:

```bash
# Clear Metro cache
cd example-app
yarn start --reset-cache

# Ensure library is built
cd ..
yarn build
```

### React Hook Errors

If you see "Invalid hook call" or "useState of null" errors:

1. Rebuild the library: `yarn build`
2. Check Metro resolver aliases are working
3. Verify no React version conflicts

### Build Errors

If TypeScript compilation fails:

```bash
# Check types without building
yarn tsc --noEmit

# Clean and rebuild
rm -rf lib/
yarn build
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run `yarn verify` to ensure quality
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Create a Pull Request

## Scripts Reference

| Command         | Description                      |
| --------------- | -------------------------------- |
| `yarn build`    | Compile TypeScript to JavaScript |
| `yarn test`     | Run unit tests                   |
| `yarn lint`     | Run ESLint                       |
| `yarn tsc`      | Type check without building      |
| `yarn verify`   | Run all quality checks           |
| `yarn start`    | Start Metro for main project     |
| `yarn cleaning` | Clean node_modules and caches    |
