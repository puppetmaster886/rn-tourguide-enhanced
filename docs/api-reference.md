# API Reference

## Components

### TourGuideProvider

The main provider component that should be placed at the root of your application.

```tsx
import { TourGuideProvider } from 'rn-tourguide-enhanced'

function App() {
  return (
    <TourGuideProvider {...providerProps}>
      <YourApp />
    </TourGuideProvider>
  )
}
```

#### Props

```typescript
interface TourGuideProviderProps {
  children: React.ReactNode

  // Tooltip customization
  tooltipComponent?: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>

  // Labels for i18n
  labels?: Labels

  // Tour behavior
  startAtMount?: boolean | string  // boolean for single tours, string for keyed tours
  dismissOnPress?: boolean
  preventOutsideInteraction?: boolean
  persistTooltip?: boolean  // Keep tooltip visible during step transitions

  // Visual styling
  backdropColor?: string
  borderRadius?: number
  maskOffset?: number
  animationDuration?: number
  wrapperStyle?: StyleProp<ViewStyle>

  // Platform specific
  androidStatusBarVisible?: boolean
  verticalOffset?: number

  // LeaderLine configuration
  leaderLineConfig?: LeaderLineConfig
}

interface Labels {
  skip?: string
  previous?: string
  next?: string
  finish?: string
}
```

**Example:**

```tsx
<TourGuideProvider
  backdropColor="rgba(0, 0, 0, 0.7)"
  borderRadius={16}
  persistTooltip={true}
  labels={{
    skip: 'Skip',
    previous: 'Back',
    next: 'Next',
    finish: 'Done',
  }}
  leaderLineConfig={{
    color: 'white',
    size: 4,
  }}
>
  <App />
</TourGuideProvider>
```

---

### TourGuideZone

Wrapper component to define a step in the tour guide.

```tsx
import { TourGuideZone } from 'rn-tourguide-enhanced'

<TourGuideZone zone={1} text="Step text">
  <YourComponent />
</TourGuideZone>
```

#### Props

```typescript
interface TourGuideZoneProps<T = any> {
  zone: number  // Step order (positive number)
  children: React.ReactNode

  // Optional props
  tourKey?: string  // For multiple tours
  isTourGuide?: boolean  // Return children without wrapping if false
  text?: string  // Tooltip text
  tooltipCustomData?: T  // Custom data passed to tooltip component

  // Shape and masking
  shape?: Shape
  maskOffset?: number | MaskOffsetObject
  borderRadius?: number

  // Tooltip positioning
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  tooltipLeftOffset?: number
  tooltipPosition?: TooltipPosition

  // LeaderLine configuration
  leaderLineConfig?: LeaderLineConfig
}

type Shape = 'circle' | 'rectangle' | 'circle_and_keep' | 'rectangle_and_keep'
type TooltipPosition = 'centered' | 'relative' | 'auto'

interface MaskOffsetObject {
  top?: number
  bottom?: number
  left?: number
  right?: number
}
```

**Example:**

```tsx
<TourGuideZone
  zone={1}
  text="Welcome to the app!"
  shape="rectangle"
  maskOffset={{ top: 20, bottom: 15, left: 10, right: 25 }}
  tooltipPosition="centered"
  leaderLineConfig={{
    color: '#4CAF50',
    size: 6,
  }}
>
  <Button title="Get Started" />
</TourGuideZone>
```

---

### TourGuideZoneByPosition

Component to create a tour guide zone based on absolute positioning.

```tsx
import { TourGuideZoneByPosition } from 'rn-tourguide-enhanced'

<TourGuideZoneByPosition
  zone={1}
  isTourGuide
  top={100}
  left={50}
  width={200}
  height={100}
  text="This area is important"
/>
```

#### Props

Extends `TourGuideZoneProps` with additional positioning props:

```typescript
interface TourGuideZoneByPositionProps extends TourGuideZoneProps {
  top?: number
  left?: number
  width?: number
  height?: number
  bottom?: number
  right?: number
}
```

---

## Hooks

### useTourGuideController

Hook to control the tour guide programmatically.

```tsx
import { useTourGuideController } from 'rn-tourguide-enhanced'

function MyComponent() {
  const {
    canStart,
    start,
    stop,
    eventEmitter,
    tourKey,
    TourGuideZone,  // For keyed tours
  } = useTourGuideController(tourKey?)

  // Use the controller
}
```

#### Return Value

```typescript
interface TourGuideController {
  canStart: boolean  // Indicates if tour can start (all zones registered)
  start: (fromStep?: number, scrollRef?: React.RefObject) => void
  stop: () => void
  eventEmitter: Emitter  // mitt event emitter
  tourKey?: string  // Current tour key
  TourGuideZone?: React.ComponentType<TourGuideZoneProps>  // Keyed zone component
}
```

#### Events

```typescript
eventEmitter.on('start', () => {})
eventEmitter.on('stop', () => {})
eventEmitter.on('stepChange', (step: Step) => {})
```

**Example:**

```tsx
const AppContent = () => {
  const { canStart, start, stop, eventEmitter } = useTourGuideController()

  React.useEffect(() => {
    if (canStart) {
      start()  // Start from step 1
    }
  }, [canStart])

  React.useEffect(() => {
    const handleStepChange = (step) => {
      console.log('Current step:', step.order)
    }

    eventEmitter.on('stepChange', handleStepChange)
    return () => eventEmitter.off('stepChange', handleStepChange)
  }, [])

  return (
    <View>
      <Button title="Start Tour" onPress={() => start()} />
      <Button title="Stop Tour" onPress={stop} />
    </View>
  )
}
```

---

## Advanced Features

### Multiple Tours

Use `tourKey` to manage multiple independent tours. The library supports flexible usage patterns to fit your needs.

#### Basic Multiple Tours

**Option 1: Using the default tour**

```tsx
const { canStart, start } = useTourGuideController()  // Uses '_default' tour key

return (
  <TourGuideZone zone={1} text="Step 1">
    <Component />
  </TourGuideZone>
)
```

**Option 2: Named tours with explicit tourKey**

```tsx
// Define tour zones with explicit tourKey
const { canStart, start } = useTourGuideController('onboarding')

return (
  <TourGuideZone tourKey="onboarding" zone={1} text="Welcome!">
    <Component />
  </TourGuideZone>
)
```

**Option 3: Using the pre-keyed TourGuideZone component**

The hook returns a `TourGuideZone` component that automatically applies the tourKey:

```tsx
const { canStart, start, TourGuideZone } = useTourGuideController('onboarding')

return (
  // No need to pass tourKey - it's already bound to 'onboarding'
  <TourGuideZone zone={1} text="Step 1">
    <Component />
  </TourGuideZone>
)
```

**Option 4: Mixing hook tourKey with zone-specific override**

You can call the hook without a tourKey and specify it per-zone:

```tsx
const { start } = useTourGuideController()  // No tourKey specified

return (
  <>
    {/* This zone uses 'onboarding' tour */}
    <TourGuideZone tourKey="onboarding" zone={1} text="Welcome">
      <Component1 />
    </TourGuideZone>

    {/* This zone uses 'features' tour */}
    <TourGuideZone tourKey="features" zone={1} text="New Features">
      <Component2 />
    </TourGuideZone>
  </>
)
```

**Option 5: Override tourKey from hook**

Even when using the pre-keyed `TourGuideZone`, you can override the tourKey:

```tsx
const { TourGuideZone } = useTourGuideController('onboarding')

return (
  <>
    {/* Uses 'onboarding' from hook */}
    <TourGuideZone zone={1} text="Step 1">
      <Component1 />
    </TourGuideZone>

    {/* Overrides to use 'advanced' tour */}
    <TourGuideZone tourKey="advanced" zone={1} text="Advanced Step">
      <Component2 />
    </TourGuideZone>
  </>
)
```

#### Multiple Controllers for Same Tour

**New in v3.6.5:** You can now use `useTourGuideController` from multiple components with the same `tourKey` without conflicts!

```tsx
// In HeaderComponent.tsx
const HeaderActions = () => {
  const { start, stop } = useTourGuideController('onboarding')

  return (
    <View>
      <Button title="Start Tour" onPress={() => start()} />
      <Button title="Stop Tour" onPress={stop} />
    </View>
  )
}

// In SidebarComponent.tsx
const SidebarActions = () => {
  const { start, canStart } = useTourGuideController('onboarding')  // Same tourKey!

  return (
    <View>
      {canStart && (
        <TouchableOpacity onPress={() => start()}>
          <Text>Begin Onboarding</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
```

Both components can control the **same tour** without interfering with each other. This is useful when you need tour controls in different parts of your UI.

### Custom Tooltips

Create custom tooltip components:

```typescript
import type { TooltipProps } from 'rn-tourguide-enhanced'

const CustomTooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
  connectionRef,  // For LeaderLine connection
}: TooltipProps) => {
  return (
    <View ref={connectionRef}>
      <Text>{currentStep.text}</Text>
      <Button onPress={isLastStep ? handleStop : handleNext}>
        {isLastStep ? labels?.finish : labels?.next}
      </Button>
    </View>
  )
}

<TourGuideProvider tooltipComponent={CustomTooltip}>
  <App />
</TourGuideProvider>
```

### Custom Tooltip Data

Pass custom data to your tooltips using TypeScript generics:

```typescript
interface MyTooltipData {
  title: string
  description: string
  image?: ImageSourcePropType
}

const CustomTooltip = ({ tooltipCustomData }: TooltipProps<MyTooltipData>) => {
  return (
    <View>
      <Text>{tooltipCustomData?.title}</Text>
      <Text>{tooltipCustomData?.description}</Text>
    </View>
  )
}

<TourGuideProvider<MyTooltipData> tooltipComponent={CustomTooltip}>
  <TourGuideZone
    zone={1}
    tooltipCustomData={{
      title: "Welcome",
      description: "This is the first step"
    }}
  >
    <Component />
  </TourGuideZone>
</TourGuideProvider>
```

See [Custom Tooltip Example](./examples/custom-tooltip.md) for complete details.

### ScrollView Support

Automatically scroll to tour steps inside ScrollViews:

```tsx
const AppContent = () => {
  const scrollRef = React.useRef(null)
  const { start, canStart } = useTourGuideController()

  React.useEffect(() => {
    if (canStart) {
      start(1, scrollRef)  // Pass scrollRef as second parameter
    }
  }, [canStart])

  return (
    <ScrollView ref={scrollRef}>
      <TourGuideZone zone={1} text="This will auto-scroll">
        <Content />
      </TourGuideZone>
    </ScrollView>
  )
}
```

### Tooltip Positioning Strategies

Control how tooltips are positioned:

```tsx
// 'relative' - Position relative to highlighted element (default)
<TourGuideZone zone={1} tooltipPosition="relative">
  <Component />
</TourGuideZone>

// 'centered' - Always center on screen
<TourGuideZone zone={2} tooltipPosition="centered">
  <Component />
</TourGuideZone>

// 'auto' - Smart positioning (centers if no overlap, relative if overlap)
<TourGuideZone zone={3} tooltipPosition="auto">
  <Component />
</TourGuideZone>
```

### Enhanced Mask Offset

Define different offsets for each direction:

```tsx
// Traditional single offset (still supported)
<TourGuideZone zone={1} maskOffset={10}>
  <Component />
</TourGuideZone>

// Enhanced directional offsets
<TourGuideZone
  zone={2}
  maskOffset={{ top: 20, bottom: 15, left: 10, right: 25 }}
>
  <Component />
</TourGuideZone>
```

### LeaderLine Configuration

Customize arrow connections between tooltips and elements. See [LeaderLine Documentation](./leader-line.md) for complete details.

```tsx
// Global configuration
<TourGuideProvider
  leaderLineConfig={{
    color: 'white',
    size: 4,
    path: 'straight',
    endPlug: 'arrow1',
  }}
>
  <App />
</TourGuideProvider>

// Per-zone configuration
<TourGuideZone
  zone={1}
  leaderLineConfig={{
    color: '#4CAF50',
    size: 6,
    path: 'arc',
  }}
>
  <Component />
</TourGuideZone>
```

---

## TypeScript Types

All types are exported from the main package:

```typescript
import type {
  TourGuideProviderProps,
  TourGuideZoneProps,
  TooltipProps,
  Labels,
  Shape,
  TooltipPosition,
  LeaderLineConfig,
  Step,
  IStep,
} from 'rn-tourguide-enhanced'
```
