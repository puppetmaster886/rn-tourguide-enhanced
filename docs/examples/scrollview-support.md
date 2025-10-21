# ScrollView Support Example

The tour guide now works seamlessly inside ScrollViews with automatic scrolling to tour steps.

## Basic Usage

Pass a scroll reference to automatically scroll to tour steps:

```tsx
import React from 'react'
import { ScrollView, View, Text, Button } from 'react-native'
import {
  TourGuideProvider,
  TourGuideZone,
  useTourGuideController,
} from 'rn-tourguide-enhanced'

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
      <TourGuideZone zone={1} text='Welcome! This is at the top'>
        <Text style={{ fontSize: 24, margin: 20 }}>Step 1</Text>
      </TourGuideZone>

      <View style={{ height: 800 }}>
        {/* Spacer to demonstrate scrolling */}
      </View>

      <TourGuideZone zone={2} text='This step will auto-scroll into view'>
        <Button title='Step 2 - Far Down' onPress={() => {}} />
      </TourGuideZone>

      <View style={{ height: 800 }}>
        {/* Another spacer */}
      </View>

      <TourGuideZone zone={3} text='Final step, also auto-scrolls'>
        <Text style={{ fontSize: 24, margin: 20 }}>Step 3</Text>
      </TourGuideZone>
    </ScrollView>
  )
}

function App() {
  return (
    <TourGuideProvider>
      <AppContent />
    </TourGuideProvider>
  )
}

export default App
```

## How It Works

1. Create a `ref` for your ScrollView: `const scrollRef = React.useRef(null)`
2. Attach the ref to your ScrollView: `<ScrollView ref={scrollRef}>`
3. Pass the ref to `start()`: `start(stepNumber, scrollRef)`

The tour guide will automatically:
- Measure the position of each step
- Calculate the optimal scroll position
- Smoothly scroll to make the step visible
- Show the tooltip once scrolling completes

## Manual Control

You can also manually control which step to start from:

```tsx
const { start } = useTourGuideController()

// Start from a specific step
const handleStartTour = () => {
  start(2, scrollRef) // Start from step 2 with scroll support
}

return (
  <View>
    <Button title="Start Tour from Step 2" onPress={handleStartTour} />
    <ScrollView ref={scrollRef}>
      {/* Your zones */}
    </ScrollView>
  </View>
)
```

## With Persistent Tooltips

Combine with persistent tooltips for a smoother experience:

```tsx
function App() {
  return (
    <TourGuideProvider persistTooltip={true}>
      <AppContent />
    </TourGuideProvider>
  )
}

const AppContent = () => {
  const scrollRef = React.useRef(null)
  const { start, canStart } = useTourGuideController()

  React.useEffect(() => {
    if (canStart) {
      start(1, scrollRef)
    }
  }, [canStart])

  return (
    <ScrollView ref={scrollRef}>
      {/* Tooltip stays visible during step transitions */}
      <TourGuideZone zone={1} text='Step 1'>
        <Component />
      </TourGuideZone>
      <TourGuideZone zone={2} text='Step 2'>
        <Component />
      </TourGuideZone>
    </ScrollView>
  )
}
```

## Limitations

- Works with `ScrollView` from React Native
- For other scroll containers (e.g., `FlatList`, `SectionList`), you may need custom scroll logic
- Ensure your ScrollView has a ref attached before calling `start()`

## Complete Example

```tsx
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import {
  TourGuideProvider,
  TourGuideZone,
  useTourGuideController,
} from 'rn-tourguide-enhanced'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  spacer: {
    height: 600,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
})

const AppContent = () => {
  const scrollRef = React.useRef(null)
  const { start, stop, canStart, eventEmitter } = useTourGuideController()

  React.useEffect(() => {
    if (canStart) {
      // Automatically start tour when ready
      start(1, scrollRef)
    }
  }, [canStart])

  React.useEffect(() => {
    const handleStepChange = (step) => {
      console.log('Navigated to step:', step.order)
    }

    eventEmitter.on('stepChange', handleStepChange)
    return () => eventEmitter.off('stepChange', handleStepChange)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollRef}>
        {/* Header Section */}
        <TourGuideZone
          zone={1}
          text='Welcome to the app! This is the header section.'
          shape='rectangle'
          borderRadius={8}
        >
          <View style={styles.section}>
            <Text style={styles.title}>Header</Text>
            <Text style={styles.description}>
              Main navigation and app title
            </Text>
          </View>
        </TourGuideZone>

        <View style={styles.spacer} />

        {/* Content Section */}
        <TourGuideZone
          zone={2}
          text='This is the main content area. Scroll here automatically!'
          shape='rectangle'
          borderRadius={8}
        >
          <View style={styles.section}>
            <Text style={styles.title}>Content</Text>
            <Text style={styles.description}>
              Main app content goes here
            </Text>
          </View>
        </TourGuideZone>

        <View style={styles.spacer} />

        {/* Actions Section */}
        <TourGuideZone
          zone={3}
          text='These are important action buttons.'
          shape='rectangle'
          borderRadius={8}
        >
          <View style={styles.section}>
            <Button title='Primary Action' onPress={() => {}} />
          </View>
        </TourGuideZone>

        <View style={styles.spacer} />

        {/* Footer Section */}
        <TourGuideZone
          zone={4}
          text='Finally, this is the footer. Tour complete!'
          shape='rectangle'
          borderRadius={8}
        >
          <View style={styles.section}>
            <Text style={styles.title}>Footer</Text>
            <Text style={styles.description}>Additional information</Text>
          </View>
        </TourGuideZone>

        {/* Control Buttons */}
        <View style={{ padding: 20, marginTop: 20 }}>
          <Button
            title='Restart Tour'
            onPress={() => start(1, scrollRef)}
          />
          <View style={{ height: 10 }} />
          <Button title='Stop Tour' onPress={stop} color='#dc3545' />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <TourGuideProvider
      persistTooltip={true}
      backdropColor='rgba(0, 0, 0, 0.7)'
      borderRadius={16}
    >
      <AppContent />
    </TourGuideProvider>
  )
}
```

## Tips

1. **Smooth Scrolling**: The library uses animated scrolling for a better user experience
2. **Timing**: Wait for `canStart` to be `true` before calling `start()` to ensure all zones are registered
3. **Nested ScrollViews**: Only pass the ref of the primary ScrollView that contains your tour zones
4. **Performance**: For very long lists, consider using pagination or sectioned tours
