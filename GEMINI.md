# GEMINI.md

## Project Overview

This project is a React Native library called `rn-tourguide-enhanced`. It provides a flexible and customizable tour guide for React Native apps, with support for web as well. It is a rewrite of the popular `react-native-copilot` library.

The library allows developers to create step-by-step tutorials and walkthroughs within their applications to guide users through new features or complex workflows.

**Key Features:**

*   **Cross-Platform:** Works on iOS, Android, and Web.
*   **Customizable:** The look and feel of the tour guide can be customized, including the tooltip, mask, and labels.
*   **Multiple Tours:** Supports the creation of multiple independent tours within the same application.
*   **ScrollView Support**: Tour guide now works seamlessly inside ScrollViews with automatic scrolling to steps
*   **Persistent Tooltips**: New `persistTooltip` prop to keep tooltips visible during step transitions
*   **Fine-grained Control:** Provides hooks and an event emitter for programmatic control over the tour.
*   **TypeScript Support:** The library is written in TypeScript and provides type definitions.
*   **Enhanced Mask Offset**: Support for directional mask offsets with `{ top, bottom, left, right }` object format.

**Architecture:**

The library is built using React Native and Expo. It leverages `react-native-svg` for creating the mask and highlighting effect, and `flubber` for smooth shape animations. The core logic is written in TypeScript.

The main components are:

*   `TourGuideProvider`: The main provider component that should be placed at the root of the application.
*   `TourGuideZone`: A wrapper component to define a step in the tour.
*   `TourGuideZoneByPosition`: A component to create a tour guide zone based on absolute positioning.
*   `useTourGuideController`: A hook to control the tour guide (start, stop, etc.).

## Building and Running

### Prerequisites

*   Node.js >= 18 (see `.nvmrc`)
*   Yarn package manager
*   React Native development environment

### Installation

```bash
yarn install
```

### Running the Demo App

To run the included demo application:

```bash
# Navigate to example app
cd example-app

# Install dependencies
npm install

# Start Metro bundler
yarn start --reset-cache --port 8086

# In another terminal, run on Android
npx react-native run-android --port=8086

# Or run on iOS
npx react-native run-ios --port=8086
```

### Building the Library

To build the library from the TypeScript source:

```bash
yarn build
```

This will compile the TypeScript files from `src` into JavaScript files in the `lib` directory.

### Running Tests

To run the unit tests:

```bash
yarn test
```

### Linting

To lint the codebase:

```bash
# Run ESLint
yarn lint

# Fix linting issues automatically
yarn lint --fix

# Type checking with TypeScript
yarn tsc

# Build and verify everything
yarn verify
```

## Development Conventions

*   **TypeScript:** The project is written in TypeScript with strict type checking enabled.
*   **Testing:** Unit tests are written using Jest and React Native Testing Library. Test files are located alongside the files they test and have the `.test.ts` or `.test.tsx` extension.
*   **Linting:** ESLint is used for linting the code. The configuration is in `.eslintrc.json`.
*   **Commits:** Commit messages should follow the Conventional Commits specification.
*   **Pull Requests:** Pull requests are welcome. Please ensure that the tests and linter pass before submitting a pull request.
*   **Development Workflow**: When making changes to the library source code, edit files in `src/`, then run `yarn build` and reload the example app.