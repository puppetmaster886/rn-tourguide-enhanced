# Installation Guide

## Requirements

- **Node.js**: >= 18
- **React Native**: >= 0.70.0
- **React**: >= 18.0.0
- **react-native-svg**: >= 12.0.0 < 16.0.0

## Install Package

```bash
yarn add rn-tourguide-enhanced
```

or with npm:

```bash
npm install rn-tourguide-enhanced
```

## Install Dependencies

This library requires the following peer dependencies:

### react-native-svg

Required for SVG rendering and arrow connections:

```bash
yarn add react-native-svg
```

For React Native CLI projects:

```bash
react-native link react-native-svg
```

For Expo projects:

```bash
expo install react-native-svg
```

### react-native-leader-line

This is automatically included as a dependency and provides the arrow connection functionality. No additional installation needed.

## Compatibility Matrix

| rn-tourguide-enhanced | React Native | React     | react-native-svg   |
| --------------------- | ------------ | --------- | ------------------ |
| 3.5.2+                | >= 0.70.0    | >= 18.0.0 | >= 12.0.0 < 16.0.0 |
| 3.5.0 - 3.5.1         | >= 0.74.5    | >= 18.0.0 | >= 15.2.0          |

**Note:** Version 3.5.2+ restores compatibility with React Native 0.70.x - 0.73.x thanks to updated `react-native-leader-line` dependency.

## Quick Start

After installation, wrap your app with `TourGuideProvider`:

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

## Next Steps

- Check out the [API Reference](./api-reference.md) for detailed component props
- Learn about [LeaderLine arrow customization](./leader-line.md)
- See [examples](./examples/) for advanced usage patterns
- Read the [Contributing Guide](./contributing.md) if you want to help develop the library
