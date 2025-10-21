# Custom Tooltip Data Example

This library now supports passing custom data from each `TourGuideZone` to your custom tooltip component using TypeScript generics.

## Overview

You can define a custom data type and pass it through the tour guide system in a type-safe manner:

1. Define your custom data type
2. Pass the type as a generic to `TourGuideProvider`
3. Add `tooltipCustomData` to each `TourGuideZone`
4. Access the data in your custom tooltip component

## Complete Example

```typescript
import React from 'react'
import { View, Text, Image, ImageSourcePropType } from 'react-native'
import {
  TourGuideProvider,
  TourGuideZone,
  TooltipProps,
  useTourGuideController,
} from 'rn-tourguide-enhanced'

// 1. Define your custom data type
interface MyTooltipData {
  title: string
  description: string
  image?: ImageSourcePropType
  helpUrl?: string
}

// 2. Create a custom tooltip component that uses the custom data
const CustomTooltip = ({
  currentStep,
  tooltipCustomData,
  handleNext,
  handlePrev,
  handleStop,
  isFirstStep,
  isLastStep,
}: TooltipProps<MyTooltipData>) => {
  return (
    <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 16 }}>
      {/* Display custom title */}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
        {tooltipCustomData?.title || currentStep.text}
      </Text>

      {/* Display custom description */}
      {tooltipCustomData?.description && (
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
          {tooltipCustomData.description}
        </Text>
      )}

      {/* Display custom image if provided */}
      {tooltipCustomData?.image && (
        <Image
          source={tooltipCustomData.image}
          style={{ width: '100%', height: 150, borderRadius: 8, marginBottom: 12 }}
          resizeMode="cover"
        />
      )}

      {/* Display help URL if provided */}
      {tooltipCustomData?.helpUrl && (
        <Text style={{ fontSize: 12, color: '#0066cc', marginBottom: 12 }}>
          Learn more: {tooltipCustomData.helpUrl}
        </Text>
      )}

      {/* Navigation buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {!isFirstStep && (
          <Button title="Previous" onPress={handlePrev} />
        )}
        {!isLastStep ? (
          <Button title="Next" onPress={handleNext} />
        ) : (
          <Button title="Finish" onPress={handleStop} />
        )}
      </View>
    </View>
  )
}

// 3. Use the TourGuideProvider with the generic type
const App = () => {
  const { canStart, start } = useTourGuideController()

  return (
    <TourGuideProvider<MyTooltipData> tooltipComponent={CustomTooltip}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Zone 1: Welcome with custom data */}
        <TourGuideZone
          zone={1}
          text="Welcome"
          tooltipCustomData={{
            title: "Welcome to the App!",
            description: "This is a comprehensive tour of all the features available in this application.",
            image: require('./assets/welcome.png'),
          }}
        >
          <Text>Welcome Screen</Text>
        </TourGuideZone>

        {/* Zone 2: Profile with custom data */}
        <TourGuideZone
          zone={2}
          text="Profile"
          tooltipCustomData={{
            title: "Your Profile",
            description: "Here you can edit your personal information, change your avatar, and manage your settings.",
            image: require('./assets/profile.png'),
            helpUrl: "https://help.example.com/profile",
          }}
        >
          <Text>Profile Section</Text>
        </TourGuideZone>

        {/* Zone 3: Settings with custom data */}
        <TourGuideZone
          zone={3}
          text="Settings"
          tooltipCustomData={{
            title: "Customize Your Experience",
            description: "Toggle features, adjust preferences, and control notifications from this panel.",
          }}
        >
          <Text>Settings Panel</Text>
        </TourGuideZone>

        {/* Start button */}
        <Button
          title="Start Tour"
          onPress={() => start()}
          disabled={!canStart}
        />
      </View>
    </TourGuideProvider>
  )
}

export default App
```

## TypeScript Benefits

### Type Safety
The generic type provides full type safety:

```typescript
// ✅ Correct - matches MyTooltipData interface
<TourGuideZone
  zone={1}
  tooltipCustomData={{
    title: "Hello",
    description: "World",
    image: require('./image.png'),
  }}
>
  <Text>Content</Text>
</TourGuideZone>

// ❌ TypeScript Error - 'foo' is not in MyTooltipData
<TourGuideZone
  zone={2}
  tooltipCustomData={{
    foo: "bar", // Error: Object literal may only specify known properties
  }}
>
  <Text>Content</Text>
</TourGuideZone>
```

### Autocomplete in Custom Tooltip
Your IDE will provide autocomplete for `tooltipCustomData`:

```typescript
const CustomTooltip = ({ tooltipCustomData }: TooltipProps<MyTooltipData>) => {
  // Autocomplete will suggest: title, description, image, helpUrl
  return <Text>{tooltipCustomData?.title}</Text>
}
```

## Advanced Usage

### Optional Custom Data
The `tooltipCustomData` prop is optional. You can mix zones with and without custom data:

```typescript
<TourGuideProvider<MyTooltipData> tooltipComponent={CustomTooltip}>
  {/* Zone with custom data */}
  <TourGuideZone zone={1} tooltipCustomData={{ title: "Hello" }}>
    <Text>With custom data</Text>
  </TourGuideZone>

  {/* Zone without custom data - tooltipCustomData will be undefined */}
  <TourGuideZone zone={2}>
    <Text>Without custom data</Text>
  </TourGuideZone>
</TourGuideProvider>
```

### Dynamic Content Based on Custom Data
You can use custom data to completely customize tooltip behavior:

```typescript
interface CustomData {
  type: 'info' | 'warning' | 'success'
  title: string
  icon: string
}

const DynamicTooltip = ({ tooltipCustomData }: TooltipProps<CustomData>) => {
  const backgroundColor = {
    info: '#0066cc',
    warning: '#ff9900',
    success: '#00cc66',
  }[tooltipCustomData?.type || 'info']

  return (
    <View style={{ backgroundColor, padding: 20 }}>
      <Text>{tooltipCustomData?.icon}</Text>
      <Text>{tooltipCustomData?.title}</Text>
    </View>
  )
}
```

## Using with TourGuideZoneByPosition

The same approach works with `TourGuideZoneByPosition`:

```typescript
<TourGuideZoneByPosition
  zone={1}
  top={100}
  left={50}
  width={200}
  height={100}
  tooltipCustomData={{
    title: "Positioned Zone",
    description: "This zone is positioned absolutely",
  }}
/>
```

## Backward Compatibility

This feature is completely backward compatible. Existing code without generics will continue to work:

```typescript
// Still works without generics
<TourGuideProvider tooltipComponent={MyTooltip}>
  <TourGuideZone zone={1} text="Old style">
    <Text>Content</Text>
  </TourGuideZone>
</TourGuideProvider>
```

## Notes

- The generic type defaults to `any`, so you don't need to specify it if you don't need type safety
- `tooltipCustomData` is available in all tooltip props alongside `currentStep`
- The data flows through: `TourGuideZone` → `Step` → `ConnectedStep` → `IStep` → `Modal` → `TooltipComponent`
