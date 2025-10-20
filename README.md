<h1 align="center">RN-TourGuide</h1>

<p align="center">
  A flexible <strong>tourguide</strong> for your react native app!
  <br/><small>🎉 Webable 🎉</small>
  <br/><small>(an enhanced version of rn-tourguide with arrow connections)</small>
</p>

## Demo Example App

<p align="center">
  <img width="300" src="./demo-recording.gif" alt="Demo Example App Recording" />
</p>

## 🚀 Key Differences from rn-tourguide

This library is an **enhanced version** of `rn-tourguide` with significant improvements and new features:

### 🎯 Enhanced Arrow Connections with react-native-leader-line

The most significant addition is the integration of **[react-native-leader-line](https://github.com/puppetmaster886/react-native-leader-line)** which provides:

- **Visual connector arrows** between highlighted elements and tooltips
- **Highly customizable** arrow styles, colors, and animations
- **Smart positioning** that adapts to different screen sizes and orientations
- **Built-in by default** - no additional setup required

```tsx
// Arrows are enabled by default
<TourGuideZone zone={1} text="Connected with arrow!">
  <Button title="Highlighted Element" />
</TourGuideZone>

// Customize arrow appearance
<TourGuideZone
  zone={2}
  text="Custom arrow style"
  leaderLineConfig={{
    color: '#FF6B6B',
    size: 3,
    startPlug: 'circle',
    endPlug: 'arrow3'
  }}
>
  <Button title="Custom Arrow" />
</TourGuideZone>
```

📖 **[Complete LeaderLine Documentation](./LEADER_LINE.md)**

### 🎨 Enhanced Positioning & Layout

- **Smart tooltip positioning** with `tooltipPosition` prop (`'relative'`, `'centered'`, `'auto'`)
- **Enhanced mask offsets** with directional control (`{ top: 20, bottom: 15, left: 10, right: 25 }`)
- **ScrollView integration** with automatic scrolling to tour steps
- **Persistent tooltips** that remain visible during step transitions

### 🌐 Improved Cross-Platform Support

- **Full web compatibility** with React Native Web
- **Better mobile responsiveness** across different screen sizes
- **Enhanced TypeScript support** with comprehensive type definitions
- **Modern React patterns** using hooks instead of HOCs

### 🔧 Developer Experience Improvements

- **Enhanced LeaderLine integration** with `react-native-leader-line` for visual arrow connections
- **Improved positioning controls** with enhanced mask offsets and tooltip positioning
- **Better ScrollView support** with automatic scrolling to tour steps
- **Enhanced TypeScript support** with more comprehensive type definitions
- **Performance optimizations** and bug fixes over the original `rn-tourguide`

<div align="center">
  <p align="center">
    <a href="https://www.npmjs.com/package/rn-tourguide">
      <img alt="npm downloads" src="https://img.shields.io/npm/dm/rn-tourguide.svg"/>
    </a>
    <a href="https://www.npmjs.com/package/rn-tourguide">
      <img src="https://img.shields.io/npm/v/rn-tourguide.svg" alt="NPM Version" />
    </a>
    <a href="http://reactnative.gallery/xcarpentier/rn-tourguide">
      <img src="https://img.shields.io/badge/reactnative.gallery-%F0%9F%8E%AC-green.svg"/></a>
    </a>
    <a href="#hire-an-expert">
      <img src="https://img.shields.io/badge/%F0%9F%92%AA-hire%20an%20expert-brightgreen"/>
    </a>
  </p>
</div>

## Installation

```bash
yarn add rn-tourguide-enhanced
```

### Dependencies

This library requires the following peer dependencies:

```bash
# Required for SVG rendering and arrow connections
yarn add react-native-svg

# Required for drawing connector arrows (included automatically)
yarn add react-native-leader-line
```

For React Native CLI projects:

```bash
react-native link react-native-svg
```

If you are using Expo:

```bash
expo install react-native-svg
```

> **Note**: `react-native-leader-line` is automatically included as a dependency and provides the arrow connection functionality. See [LeaderLine Documentation](./LEADER_LINE.md) for customization options.

## 🚀 Quick Start

```tsx
import React from 'react'
import { View, Text, Button } from 'react-native'
import {
  TourGuideProvider,
  TourGuideZone,
  useTourGuideController,
} from 'rn-tourguide-enhanced'

function App() {
  return (
    <TourGuideProvider>
      <AppContent />
    </TourGuideProvider>
  )
}

const AppContent = () => {
  const { start, canStart } = useTourGuideController()

  React.useEffect(() => {
    if (canStart) {
      start() // Start tour when ready
    }
  }, [canStart])

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TourGuideZone
        zone={1}
        text='Welcome! This is your first step with arrows!'
      >
        <Text style={{ fontSize: 24 }}>Hello World</Text>
      </TourGuideZone>

      <TourGuideZone zone={2} text='Click me to continue the tour'>
        <Button title='Next Step' onPress={() => {}} />
      </TourGuideZone>
    </View>
  )
}

export default App
```

**Key features you get out of the box:**

- ✅ **Automatic arrow connections** between tooltips and highlighted elements
- ✅ **Smart positioning** that adapts to screen size and orientation
- ✅ **Web compatibility** with React Native Web
- ✅ **TypeScript support** with full type definitions

## Development

### Building the Library

To build the library from source:

```bash
# Install dependencies
yarn install

# Build the TypeScript library
yarn build
```

This will compile the TypeScript source files from `src/` into JavaScript files in `lib/`.

### Testing with the Example App

The repository includes a complete React Native example app for testing:

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

### Running Unit Tests

To run the library's unit tests:

```bash
# Run tests once
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Linting and Type Checking

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

### Development Workflow

When making changes to the library source code:

1. **Edit source files** in `src/` directory
2. **Rebuild the library**:
   ```bash
   yarn build
   ```
3. **Reload the example app** by pressing `r` in Metro or restarting the app

### Metro Configuration

The example app is configured with Metro to:

- Watch the parent directory for library changes
- Resolve React dependencies correctly to avoid multiple React instances
- Support TypeScript and JSX files

### Project Structure

```
rn-tourguide-enhanced/
├── src/                    # Library source code (TypeScript)
├── lib/                    # Compiled library output (JavaScript)
└── example-app/           # React Native test application
```

### Requirements

- **Node.js**: >= 18 (see `.nvmrc`)
- **React Native**: >= 0.70.0
- **React**: >= 18.0.0
- **react-native-svg**: >= 12.0.0 < 16.0.0

### Compatibility

| rn-tourguide-enhanced | React Native | React     | react-native-svg   |
| --------------------- | ------------ | --------- | ------------------ |
| 3.5.2+                | >= 0.70.0    | >= 18.0.0 | >= 12.0.0 < 16.0.0 |
| 3.5.0 - 3.5.1         | >= 0.74.5    | >= 18.0.0 | >= 15.2.0          |

**Note:** Version 3.5.2+ restores compatibility with React Native 0.70.x - 0.73.x thanks to updated `react-native-leader-line` dependency.

### Troubleshooting

**"Invalid hook call" errors:**

- Make sure you rebuild the library after changing source code
- Verify Metro is using the correct React instance via aliases

**Module resolution errors:**

- Restart Metro with `--reset-cache`
- Check that `lib/` directory exists and contains compiled files

### Publishing the Library

To prepare the library for publication:

```bash
# This runs tests, linting, type checking, and builds the library
yarn verify

# Publish to npm (requires npm login)
npm publish
```

The `prepublishOnly` script automatically runs `yarn verify` before publishing to ensure quality.

## Contributing

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development instructions.

Issues and Pull Requests are always welcome.

```tsx
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide'

// Add <TourGuideProvider/> at the root of you app!
function App() {
  return (
    // If you added a statusbar in Andoid set androidStatusBarVisible: true as well to avoid vertical position issues
    <TourGuideProvider {...{ borderRadius: 16 }}>
      <AppContent />
    </TourGuideProvider>
  )
}

const AppContent = () => {
  const iconProps = { size: 40, color: '#888' }

  // Use Hooks to control!
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController()

  // Can start at mount 🎉
  // you need to wait until everything is registered 😁
  React.useEffect(() => {
    if (canStart) {
      // 👈 test if you can start otherwise nothing will happen
      start()
    }
  }, [canStart]) // 👈 don't miss it!

  const handleOnStart = () => console.log('start')
  const handleOnStop = () => console.log('stop')
  const handleOnStepChange = () => console.log(`stepChange`)

  React.useEffect(() => {
    eventEmitter.on('start', handleOnStart)
    eventEmitter.on('stop', handleOnStop)
    eventEmitter.on('stepChange', handleOnStepChange)

    return () => {
      eventEmitter.off('start', handleOnStart)
      eventEmitter.off('stop', handleOnStop)
      eventEmitter.off('stepChange', handleOnStepChange)
    }
  }, [])

  return (
    <View style={styles.container}>
      {/*

          Use TourGuideZone only to wrap your component

      */}
      <TourGuideZone
        zone={2}
        text={'A react-native-copilot remastered! 🎉'}
        borderRadius={16}
      >
        <Text style={styles.title}>
          {'Welcome to the demo of\n"rn-tourguide"'}
        </Text>
      </TourGuideZone>
      <View style={styles.middleView}>
        <TouchableOpacity style={styles.button} onPress={() => start()}>
          <Text style={styles.buttonText}>START THE TUTORIAL!</Text>
        </TouchableOpacity>

        <TourGuideZone zone={3} shape={'rectangle_and_keep'}>
          <TouchableOpacity style={styles.button} onPress={() => start(4)}>
            <Text style={styles.buttonText}>Step 4</Text>
          </TouchableOpacity>
        </TourGuideZone>
        <TouchableOpacity style={styles.button} onPress={() => start(2)}>
          <Text style={styles.buttonText}>Step 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stop}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TourGuideZone
          zone={1}
          shape='circle'
          text={'With animated SVG morphing with awesome flubber 🍮💯'}
        >
          <Image source={{ uri }} style={styles.profilePhoto} />
        </TourGuideZone>
      </View>
      <View style={styles.row}>
        <TourGuideZone zone={4} shape={'circle'}>
          <Ionicons name='ios-contact' {...iconProps} />
        </TourGuideZone>
        <Ionicons name='ios-chatbubbles' {...iconProps} />
        <Ionicons name='ios-globe' {...iconProps} />
        <TourGuideZone zone={5}>
          <Ionicons name='ios-navigate' {...iconProps} />
        </TourGuideZone>
        <TourGuideZone zone={6} shape={'circle'}>
          <Ionicons name='ios-rainy' {...iconProps} />
        </TourGuideZone>
        <TourGuideZoneByPosition
          zone={7}
          shape={'circle'}
          isTourGuide
          bottom={30}
          left={35}
          width={300}
          height={300}
        />
      </View>
    </View>
  )
}
```

`TourGuide` props:

```ts
interface TourGuideZoneProps {
  zone: number // A positive number indicating the order of the step in the entire walkthrough.
  tourKey?: string // A string indicating which tour the zone belongs to
  isTourGuide?: boolean // return children without wrapping id false
  text?: string // text in tooltip
  shape?: Shape // which shape
  maskOffset?: number // offset around zone
  borderRadius?: number // round corner when rectangle
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  tooltipLeftOffset?: number
  tooltipPosition?: TooltipPosition // 'relative' | 'centered' | 'auto' - controls tooltip positioning strategy
  children: React.ReactNode
}

type Shape = 'circle' | 'rectangle' | 'circle_and_keep' | 'rectangle_and_keep'
type TooltipPosition = 'centered' | 'relative' | 'auto'

export interface TourGuideProviderProps {
  tooltipComponent?: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  labels?: Labels
  startAtMount?: boolean | string //  start at mount, boolean for single tours, string for multiple tours
  androidStatusBarVisible?: boolean
  backdropColor?: string
  verticalOffset?: number
  wrapperStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  borderRadius?: number
  animationDuration?: number
  children: React.ReactNode
  dismissOnPress?: boolean
  preventOutsideInteraction?: boolean
  persistTooltip?: boolean // do not hide tooltip on step change
}

interface TooltipProps {
  isFirstStep?: boolean
  isLastStep?: boolean
  currentStep: Step
  labels?: Labels
  handleNext?(): void
  handlePrev?(): void
  handleStop?(): void
}

interface Labels {
  skip?: string
  previous?: string
  next?: string
  finish?: string
}
```

In order to start the tutorial, you can call the `start` function from `useTourGuideController` hook:

```js
function HomeScreen() {
  const { start } = useTourGuideController()

  React.useEffect(() => {
    start()
  }, [])


  render() {
    // ...
  }
}

export default HomeScreen
```

If you are looking for a working example, please check out [this link](https://github.com/xcarpentier/rn-tourguide/blob/master/App.tsx).

## Using Multiple Tours

If you'd like to have multiple tours (different pages, differnt user types, etc) you can pass in a `tourKey` to `useTourGuideController` to create a tour that is keyed to that `tourKey`. **Important** If you use a keyed tour, in order for the `TourGuideZone` components to register correctly you _must_ do one of two things. Either (1) pass along the `tourKey` to the `TourGuideZone` components, or (2) extract the `TourGuideZone` components from the hook itself

(1) If you want to pass along the tourKey

```ts
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
const {
  canStart, // <-- These are all keyed to the tourKey
  start, // <-- These are all keyed to the tourKey
  stop, // <-- These are all keyed to the tourKey
  eventEmitter, // <-- These are all keyed to the tourKey
  tourKey, // <-- Extract the tourKey
} = useTourGuideController('results')

return (
  <TourGuideZone
    tourKey={tourKey} // <-- Pass in the tourKey
    zone={2}
    text='Check on your results'
  >
    {/** Children */}
  </TourGuideZone>
)
```

Or (2) if you want to extract the components directly from the hook

```ts
import { useTourGuideController } from 'rn-tourguide'
const { canStart, start, stop, TourGuideZone } =
  useTourGuideController('results')

return (
  <TourGuideZone // <-- No need to pass in the tourKey
    zone={2}
    text='Check on your results'
  >
    {/** Children */}
  </TourGuideZone>
)
```

If you use multiple tours and would like to use the `startAtMount` prop on the `TourGuideProvider` component, then pass in the string of the tour you'd like to start

### Custom tooltip component

You can customize the tooltip by passing a component to the `copilot` HOC maker. If you are looking for an example tooltip component, take a look at [the default tooltip implementation](https://github.com/xcarpentier/rn-tourguide/blob/master/src/components/Tooltip.tsx).

```js
const TooltipComponent = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
}) => (
  // ...
);

<TourGuideProvider {...{tooltipComponent: TooltipComponent}}>
// ...
</TourGuideProvider>
```

### Custom tooltip styling

You can customize tooltips style:

```tsx
const style = {
  backgroundColor: '#9FA8DA',
  borderRadius: 10,
  paddingTop: 5,
}

<TourGuideProvider {...{ tooltipStyle: style }}>
// ...
</TourGuideProvider>
```

### Custom mask color

You can customize the mask color - default is `rgba(0, 0, 0, 0.4)`, by passing a color string to the `copilot` HOC maker.

```tsx
<TourGuideProvider {...{ backdropColor: 'rgba(50, 50, 100, 0.9)' }}>
  // ...
</TourGuideProvider>
```

### Custom labels (for i18n)

You can localize labels:

```tsx
<TourGuideProvider
  {...{
    labels: {
      previous: 'Vorheriger',
      next: 'Nächster',
      skip: 'Überspringen',
      finish: 'Beenden',
    },
  }}
>
  // ...
</TourGuideProvider>
```

### Listening to the events

Along with `start()`, `useTourGuideController` passes `copilotEvents` function to the component to help you with tracking of tutorial progress. It utilizes [mitt](https://github.com/developit/mitt) under the hood, you can see how full API there.

List of available events is:

- `start` — Copilot tutorial has started.
- `stop` — Copilot tutorial has ended or skipped.
- `stepChange` — Next step is triggered. Passes [`Step`](https://github.com/mohebifar/react-native-copilot/blob/master/src/types.js#L2) instance as event handler argument.

### Prevent Outside Interaction

Sometimes you need to prevent users to interact with app while tour is shown, in such case `preventOutsideInteraction` prop is up for you.

`default: false`

```jsx
<TourGuideProvider preventOutsideInteraction>
  <AppContent />
</TourGuideProvider>
```

## 🆕 New Features

### 🎯 LeaderLine Arrow Connections

**Visual connector arrows** between highlighted elements and tooltips using [react-native-leader-line](https://github.com/puppetmaster886/react-native-leader-line):

```tsx
// Basic usage - arrows enabled by default
<TourGuideZone zone={1} text="Connected with arrow!">
  <Button title="Highlighted Element" />
</TourGuideZone>

// Global configuration
<TourGuideProvider
  leaderLineConfig={{
    color: '#FF6B6B',
    size: 3,
    startPlug: 'circle',
    endPlug: 'arrow3'
  }}
>
  <AppContent />
</TourGuideProvider>

// Per-zone customization
<TourGuideZone
  zone={2}
  text="Custom arrow style"
  leaderLineConfig={{
    color: '#4ECDC4',
    size: 2,
    dash: { len: 5, gap: 3 },
    path: 'arc'
  }}
>
  <Button title="Custom Arrow" />
</TourGuideZone>
```

**Available configuration options:**

- **Colors & Styling**: `color`, `size`, `dash`, `gradient`
- **Connection Points**: `startPlug`, `endPlug` (circle, arrow1, arrow2, arrow3, etc.)
- **Path Types**: `straight`, `arc`, `fluid`, `magnet`
- **Animations**: `showEffectName`, `animOptions`

📖 **[Complete LeaderLine Documentation](./LEADER_LINE.md)** for all configuration options and examples.

### ScrollView Support

The tour guide now works seamlessly inside ScrollViews. Pass a scroll reference to automatically scroll to tour steps:

```tsx
const AppContent = () => {
  const scrollRef = React.useRef(null)
  const { start, canStart } = useTourGuideController()

  React.useEffect(() => {
    if (canStart) {
      start(1, scrollRef) // Pass scrollRef as second parameter
    }
  }, [canStart])

  return (
    <ScrollView ref={scrollRef}>
      <TourGuideZone zone={1} text='This step will auto-scroll into view'>
        <Text>Content</Text>
      </TourGuideZone>
    </ScrollView>
  )
}
```

### Persistent Tooltips

Keep tooltips visible during step transitions for a smoother user experience:

```tsx
<TourGuideProvider persistTooltip={true}>
  <AppContent />
</TourGuideProvider>
```

### Custom Tooltip Positioning

#### Bottom Offset

Control the vertical position of tooltips:

```tsx
<TourGuideZone zone={1} tooltipBottomOffset={100}>
  <Button title='Custom bottom spacing' />
</TourGuideZone>
```

#### Left Offset

Control the horizontal position of tooltips:

```tsx
<TourGuideZone zone={1} tooltipLeftOffset={50}>
  <Button title='Custom left positioning' />
</TourGuideZone>
```

#### Tooltip Position Strategy

Control how the tooltip is positioned relative to the highlighted element:

```tsx
// 'relative' - Always position relative to highlighted element (default, original behavior)
// Tooltip will move to avoid overlapping with the highlighted area
<TourGuideZone zone={1} tooltipPosition='relative'>
  <Button title='Relative positioning' />
</TourGuideZone>

// 'centered' - Always center the tooltip on screen
// Useful for important messages or when you want consistent positioning
<TourGuideZone zone={2} tooltipPosition='centered'>
  <Button title='Centered tooltip' />
</TourGuideZone>

// 'auto' - Smart positioning (centers if no overlap, relative if overlap detected)
// Best of both worlds for flexible layouts
<TourGuideZone zone={3} tooltipPosition='auto'>
  <Button title='Auto positioning' />
</TourGuideZone>
```

**Available values:**

- `'relative'` (default): Tooltip always positions relative to the highlighted element, avoiding overlap. This is the original rn-tourguide behavior.
- `'centered'`: Tooltip always stays centered on screen, regardless of highlighted element position.
- `'auto'`: Automatically detects overlap. Centers the tooltip if there's no overlap with the highlighted element, otherwise uses relative positioning.

**Note:** The `tooltipLeftOffset` parameter takes precedence over `tooltipPosition` when both are specified.

### Enhanced Mask Offset

Define different mask offsets for each direction for precise highlighting:

```tsx
// Traditional single offset (still supported)
<TourGuideZone zone={1} maskOffset={10}>
  <Button title="Equal offset" />
</TourGuideZone>

// Enhanced directional offsets
<TourGuideZone
  zone={2}
  maskOffset={{ top: 20, bottom: 15, left: 10, right: 25 }}
>
  <Button title="Custom directional offsets" />
</TourGuideZone>

// Partial directional offsets (missing values default to 0)
<TourGuideZone
  zone={3}
  maskOffset={{ top: 10, left: 5 }}
>
  <Button title="Partial offsets" />
</TourGuideZone>
```

### Cross-Platform Improvements

- **Web & Mobile**: Fixed SVG mask issues on screen resize
- **Landscape Mode**: Improved modal positioning in landscape orientation
- **Android**: Better StatusBar handling with `androidStatusBarVisible` prop

## Hire an expert!

Looking for a ReactNative freelance expert with more than 14 years experience? Contact me from my [website](https://xaviercarpentier.com)!

## License

- [MIT](LICENSE) © 2020 Xavier CARPENTIER SAS, https://xaviercarpentier.com.
- [MIT](LICENSE) © 2017 OK GROW!, https://www.okgrow.com.
