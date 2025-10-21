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
  <img width="300" src="./demo-recording.gif" alt="Demo Example App Recording" />
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
