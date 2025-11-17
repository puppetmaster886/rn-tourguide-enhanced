<h1 align="center">RN-TourGuide Enhanced</h1>

<p align="center">
  A flexible <strong>tourguide</strong> for your React Native app!
  <br/><small>🎉 Webable 🎉</small>
  <br/><small>(an enhanced version of rn-tourguide with arrow connections)</small>
</p>

<div align="center">
  <p align="center">
    <a href="https://www.npmjs.com/package/rn-tourguide-enhanced">
      <img alt="npm downloads" src="https://img.shields.io/npm/dm/rn-tourguide-enhanced.svg"/>
    </a>
    <a href="https://www.npmjs.com/package/rn-tourguide-enhanced">
      <img src="https://img.shields.io/npm/v/rn-tourguide-enhanced.svg" alt="NPM Version" />
    </a>
    <a href="https://github.com/puppetmaster886/rn-tourguide-enhanced">
      <img src="https://img.shields.io/github/license/puppetmaster886/rn-tourguide-enhanced" alt="License"/>
    </a>
  </p>
</div>

## Demo Example App

<p align="center">
  <img width="300" src="https://raw.githubusercontent.com/puppetmaster886/rn-tourguide-enhanced/main/demo.gif" alt="Demo Example App Recording" />
</p>

## Key Features

### Visual Arrow Connections

The most significant enhancement is the integration of **[react-native-leader-line](https://github.com/puppetmaster886/react-native-leader-line)** which provides:

- **Visual connector arrows** between highlighted elements and tooltips
- **Highly customizable** arrow styles, colors, and animations
- **Smart positioning** that adapts to different screen sizes and orientations
- **Built-in by default** - no additional setup required

### Enhanced Positioning & Layout

- **Smart tooltip positioning** with multiple strategies (`relative`, `centered`, `auto`)
- **Enhanced mask offsets** with directional control
- **ScrollView integration** with automatic scrolling to tour steps
- **Persistent tooltips** that remain visible during step transitions

### Flexible Tour Management

- **Multiple tour support** with independent tour keys
- **Multiple controllers** can control the same tour from different components
- **Flexible tourKey assignment** - define at hook level, zone level, or both
- **Dynamic tour switching** between different tour flows

### Cross-Platform Support

- **Full web compatibility** with React Native Web
- **Mobile responsive** across different screen sizes
- **TypeScript support** with comprehensive type definitions
- **Modern React patterns** using hooks

## Quick Start

### Installation

```bash
yarn add rn-tourguide-enhanced react-native-svg
```

See the [Installation Guide](./docs/installation.md) for detailed setup instructions.

### Basic Usage

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

## Documentation

- **[Installation Guide](./docs/installation.md)** - Setup and requirements
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[LeaderLine Guide](./docs/leader-line.md)** - Customize arrow connections
- **[Contributing](./docs/contributing.md)** - Development and contribution guide

### Examples

- **[Custom Tooltip](./docs/examples/custom-tooltip.md)** - Create custom tooltip components with custom data
- **[ScrollView Support](./docs/examples/scrollview-support.md)** - Auto-scrolling in ScrollViews

## Highlights

### Arrow Connections

```tsx
// Customize arrow appearance per step
<TourGuideZone
  zone={1}
  text="Custom arrow style"
  leaderLineConfig={{
    color: '#FF6B6B',
    size: 3,
    startPlug: 'circle',
    endPlug: 'arrow3',
    path: 'arc'
  }}
>
  <Button title="Highlighted Element" />
</TourGuideZone>
```

See the [LeaderLine Documentation](./docs/leader-line.md) for all customization options.

### Smart Positioning

```tsx
// Control tooltip positioning strategy
<TourGuideZone
  zone={1}
  tooltipPosition="auto"  // 'relative' | 'centered' | 'auto'
  maskOffset={{ top: 20, bottom: 15, left: 10, right: 25 }}
>
  <Component />
</TourGuideZone>
```

### ScrollView Support

```tsx
const AppContent = () => {
  const scrollRef = React.useRef(null)
  const { start, canStart } = useTourGuideController()

  React.useEffect(() => {
    if (canStart) {
      start(1, scrollRef) // Auto-scroll to steps
    }
  }, [canStart])

  return (
    <ScrollView ref={scrollRef}>
      <TourGuideZone zone={1} text="Auto-scrolls into view">
        <Content />
      </TourGuideZone>
    </ScrollView>
  )
}
```

See the [ScrollView Example](./docs/examples/scrollview-support.md) for complete details.

### Custom Tooltips

```tsx
// Pass custom data to tooltips with TypeScript support
interface MyTooltipData {
  title: string
  image?: ImageSourcePropType
}

<TourGuideProvider<MyTooltipData> tooltipComponent={CustomTooltip}>
  <TourGuideZone
    zone={1}
    tooltipCustomData={{
      title: "Welcome",
      image: require('./welcome.png')
    }}
  >
    <Component />
  </TourGuideZone>
</TourGuideProvider>
```

See the [Custom Tooltip Example](./docs/examples/custom-tooltip.md) for complete implementation.

### Status Bar & Safe Area Handling

- iOS safe areas are automatically detected via `react-native-safe-area-context`; no extra configuration is required for devices with a notch or Dynamic Island.
- Android target measurements already include the system status bar, so no offset is applied by default. Use the cross-platform `statusBarOffset` override (or keep `androidStatusBarVisible={false}` for legacy setups) whenever you hide the status bar or render under a translucent header.

```tsx
import { StatusBar, Platform } from 'react-native'

const customOffset =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 24

<TourGuideProvider statusBarOffset={customOffset}>
  <AppContent />
</TourGuideProvider>
```

> `androidStatusBarVisible` is deprecated and will be removed in a future major release—prefer the new `statusBarOffset` API for custom adjustments.

### Multiple Tours & Flexible Controllers

**New in v3.6.5:** Enhanced flexibility for managing multiple tours and controllers.

```tsx
// Multiple components can control the same tour
// HeaderComponent.tsx
const HeaderActions = () => {
  const { start, stop } = useTourGuideController('onboarding')
  return <Button title="Start Tour" onPress={() => start()} />
}

// SidebarComponent.tsx
const SidebarActions = () => {
  const { start, canStart } = useTourGuideController('onboarding')  // Same tourKey!
  return canStart ? <Button title="Begin" onPress={() => start()} /> : null
}

// Flexible tourKey assignment
const { start, TourGuideZone } = useTourGuideController()

return (
  <>
    {/* Specify tourKey per zone */}
    <TourGuideZone tourKey="onboarding" zone={1} text="Welcome">
      <Component1 />
    </TourGuideZone>

    {/* Or use pre-keyed component from hook */}
    <TourGuideZone zone={1} text="Step 1">
      <Component2 />
    </TourGuideZone>

    {/* Or override the hook's tourKey */}
    <TourGuideZone tourKey="advanced" zone={1} text="Advanced">
      <Component3 />
    </TourGuideZone>
  </>
)
```

See the [API Reference](./docs/api-reference.md#multiple-tours) for all usage patterns.

## Requirements

- **Node.js**: >= 18
- **React Native**: >= 0.70.0
- **React**: >= 18.0.0
- **react-native-svg**: >= 12.0.0 < 16.0.0

See [Installation Guide](./docs/installation.md) for compatibility matrix.

## Contributing

We welcome contributions! See the [Contributing Guide](./docs/contributing.md) for development setup and guidelines.

Issues and Pull Requests are always welcome.

## License

- [MIT](LICENSE) © 2024 Federico Garcia (Enhanced version)
- [MIT](LICENSE) © 2020 Xavier CARPENTIER SAS (Original rn-tourguide)
- [MIT](LICENSE) © 2017 OK GROW! (Original react-native-copilot)

## Acknowledgments

- **Xavier Carpentier** - Original creator of [rn-tourguide](https://github.com/xcarpentier/rn-tourguide)
- **Mohammad Reza Besharati** - Original creator of [react-native-copilot](https://github.com/mohebifar/react-native-copilot)
- **Community Contributors** - Thank you for all the PRs and feedback

---

**Looking for a ReactNative freelance expert?** Contact Xavier Carpentier from his [website](https://xaviercarpentier.com)
