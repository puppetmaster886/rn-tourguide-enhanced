# TourGuide Example App

This is a React Native example application that demonstrates the usage of `rn-tourguide-enhanced` library.

## Prerequisites

- Node.js >= 18 (see `.nvmrc` in the root directory)
- React Native development environment set up
- Android SDK for Android testing
- Xcode for iOS testing (macOS only)

## Getting Started

### Step 1: Install Dependencies

From the example-app directory:

```bash
npm install
```

### Step 2: Build the Library

The example app imports the library from the compiled `../lib` directory. Make sure to build the library first:

```bash
# Go back to the root directory
cd ..

# Build the library
yarn build

# Return to example app
cd example-app
```

### Step 3: Start Metro Server

Start the Metro bundler with a clean cache:

```bash
yarn start --reset-cache --port 8086
```

### Step 4: Run the Application

#### For Web

```bash
yarn web
```

The app will open automatically at `http://localhost:3000`

#### For Android

In a new terminal:

```bash
npx react-native run-android --port=8086
```

#### For iOS

In a new terminal:

```bash
npx react-native run-ios --port=8086
```

## What's Included

The example app demonstrates:

- **TourGuideProvider** setup at the app root
- **TourGuideZone** components wrapping UI elements
- **useTourGuideController** hook for controlling tours
- Multiple tour steps with different configurations
- Custom tooltip component with connection points
- Custom styling and positioning
- Event handling (start, stop, step changes)
- **Cross-platform support** - Same code runs on iOS, Android, and Web

## Usage

1. Launch the app
2. Tap **"Start Tour"** to begin the guided tour
3. Follow the highlighted elements and tooltips
4. Tap **"Stop Tour"** to end the tour at any time

## Development

When making changes to the library source code (`../src/`):

1. Rebuild the library: `cd .. && yarn build`
2. Reload the app by pressing `r` in Metro or restarting

## Troubleshooting

### Metro Issues

If you encounter module resolution or bundling issues:

```bash
# Clear Metro cache
yarn start --reset-cache

# Or clean and restart
rm -rf node_modules/.cache
yarn start --reset-cache
```

### Build Issues

If the app fails to find library components:

```bash
# Make sure the library is built
cd .. && yarn build

# Check that lib/ directory exists with compiled files
ls ../lib
```

### React Hook Errors

If you see "Invalid hook call" errors:

- Ensure you've rebuilt the library after making changes
- Verify Metro is using the correct resolver configuration
- The Metro config includes aliases to prevent React duplication

## Configuration

### Metro (iOS/Android)

The example app uses a custom Metro configuration that:

- Watches the parent directory for library source changes
- Resolves React dependencies from the example app's node_modules
- Supports TypeScript and JSX file extensions

### Webpack (Web)

The web build uses webpack with:

- React Native Web for cross-platform compatibility
- Babel transpilation for modern JavaScript/TypeScript
- Hot module replacement for fast development
- Same `App.tsx` file as native platforms for consistency
