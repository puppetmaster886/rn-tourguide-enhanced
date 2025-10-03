# LeaderLine Integration Guide

This guide explains how to use and customize the LeaderLine feature in rn-tourguide-enhanced, which draws visual connector lines between highlighted elements and tooltips.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration Levels](#configuration-levels)
- [Default Configuration](#default-configuration)
- [Available Options](#available-options)
- [Custom Tooltip Connection Points](#custom-tooltip-connection-points)
- [Examples](#examples)

---

## Quick Start

LeaderLine is **enabled by default** with sensible defaults. You don't need to configure anything to see connector lines:

```tsx
import { TourGuideProvider, TourGuideZone } from 'rn-tourguide-enhanced';

function App() {
  return (
    <TourGuideProvider>
      <TourGuideZone zone={1} text="Step 1">
        <View />
      </TourGuideZone>
    </TourGuideProvider>
  );
}
```

---

## Configuration Levels

LeaderLine can be configured at three levels, with each level overriding the previous:

1. **Provider Level** - Global defaults for all steps
2. **Zone Level** - Overrides for specific zones
3. **Step Level** - (via `IStep.leaderLineConfig`) Most specific overrides

### 1. Provider Level (Global)

Configure defaults for all tour steps:

```tsx
<TourGuideProvider
  leaderLineConfig={{
    color: 'white',
    size: 4,
    endPlug: 'arrow1',
    path: 'straight',
  }}
>
  {/* All steps inherit these defaults */}
</TourGuideProvider>
```

### 2. Zone Level

Override configuration for specific zones:

```tsx
<TourGuideZone
  zone={1}
  text="Custom line for this step"
  leaderLineConfig={{
    color: '#4CAF50',      // Green line
    endPlugColor: '#4CAF50', // Green arrow
    size: 6,               // Thicker line
    path: 'arc',           // Curved line
  }}
>
  <MyComponent />
</TourGuideZone>
```

### 3. Step Level

When using the programmatic API:

```tsx
const step: IStep = {
  name: 'step1',
  order: 1,
  text: 'My step',
  leaderLineConfig: {
    color: 'blue',
    size: 3,
  },
  // ... other step properties
};
```

---

## Default Configuration

The library provides these defaults out of the box:

```tsx
{
  enabled: true,
  startSocket: 'auto',      // Auto-detect best connection point on tooltip
  endSocket: 'auto',        // Auto-detect best connection point on element
  color: 'white',           // White line
  size: 4,                  // 4px width
  endPlug: 'arrow1',        // Arrow pointing to element
  endPlugColor: 'white',    // White arrow
  path: 'straight',         // Straight line
}
```

---

## Available Options

All options from `react-native-leader-line` are supported. Here are the most commonly used:

### Basic Styling

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable the line |
| `color` | `string` | `'white'` | Line color (CSS color) |
| `size` | `number` | `4` | Line thickness in pixels |
| `strokeWidth` | `number` | - | Alternative to `size` |
| `opacity` | `number` | `1` | Line opacity (0-1) |

### Connection Points (Sockets)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startSocket` | `SocketPosition` | `'auto'` | Where line connects to tooltip |
| `endSocket` | `SocketPosition` | `'auto'` | Where line connects to element |

**SocketPosition values:**
- `'auto'` - Automatically choose best position
- `'center'` - Center of the element
- `'top'`, `'right'`, `'bottom'`, `'left'` - Side centers
- `'top_left'`, `'top_right'`, `'bottom_left'`, `'bottom_right'` - Corners

### Path Styles

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `path` | `PathType` | `'straight'` | Line path style |
| `curvature` | `number` | - | Curve amount for arc paths (0-1) |

**PathType values:**
- `'straight'` - Straight line (fastest)
- `'arc'` - Curved arc
- `'fluid'` - Smooth curved line
- `'magnet'` - Magnetic attraction style
- `'grid'` - Grid-aligned path

### Plugs (End Markers)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startPlug` | `PlugType` | - | Marker at tooltip end |
| `endPlug` | `PlugType` | `'arrow1'` | Marker at element end |
| `startPlugColor` | `string` | - | Custom color for start marker |
| `endPlugColor` | `string` | `'white'` | Custom color for end marker |
| `startPlugSize` | `number` | - | Start marker size multiplier |
| `endPlugSize` | `number` | - | End marker size multiplier |

**PlugType values:**
- `'none'` - No marker
- `'disc'` - Circular dot
- `'square'` - Square marker
- `'arrow1'`, `'arrow2'`, `'arrow3'` - Different arrow styles
- `'hand'` - Hand pointer
- `'crosshair'` - Crosshair marker
- `'diamond'` - Diamond shape

### Advanced Options

| Option | Type | Description |
|--------|------|-------------|
| `dash` | `boolean \| string \| DashOptions` | Dashed line pattern |
| `dropShadow` | `boolean \| DropShadowOptions` | Drop shadow effect |
| `outline` | `boolean \| OutlineOptions` | Line outline/border |
| `gradient` | `boolean \| object` | Gradient colors |

For complete options, see the [react-native-leader-line types](./example-app/node_modules/react-native-leader-line/lib/types/index.d.ts).

---

## Custom Tooltip Connection Points

When creating custom tooltips with padding, you can control exactly where the LeaderLine connects using the `connectionRef` prop.

### The Problem

By default, the line connects to the tooltip container's edge. If your tooltip has padding, this creates a gap:

```tsx
// ❌ Line connects to outer container edge (includes padding)
function CustomTooltip({ currentStep }: TooltipProps) {
  return (
    <View style={{ padding: 20 }}> {/* Gap here */}
      <Text>{currentStep.text}</Text>
    </View>
  );
}
```

### The Solution

Use `connectionRef` to specify the exact connection point:

```tsx
// ✅ Line connects to inner content edge (skips padding)
function CustomTooltip({ currentStep, connectionRef }: TooltipProps) {
  return (
    <View style={{ padding: 20 }}> {/* Outer container with padding */}
      <View ref={connectionRef}> {/* LeaderLine connects here! */}
        <Text>{currentStep.text}</Text>
      </View>
    </View>
  );
}
```

### Complete Example

```tsx
import { View, Text } from 'react-native';
import type { TooltipProps } from 'rn-tourguide-enhanced';

function CustomTooltip({
  currentStep,
  connectionRef, // Provided by the library
  handleNext,
  handleStop,
  isLastStep,
}: TooltipProps) {
  return (
    <View
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 20, // This padding will be skipped
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
      }}
    >
      {/* Attach connectionRef to the actual content */}
      <View ref={connectionRef}>
        <Text style={{ color: '#fff' }}>
          {currentStep.text}
        </Text>
        <Button onPress={isLastStep ? handleStop : handleNext}>
          {isLastStep ? 'Finish' : 'Next'}
        </Button>
      </View>
    </View>
  );
}

// Use it in your provider
<TourGuideProvider tooltipComponent={CustomTooltip}>
  {/* ... */}
</TourGuideProvider>
```

### When to Use connectionRef

Use `connectionRef` when:
- ✅ Your custom tooltip has outer padding
- ✅ You want the line to connect to inner content
- ✅ You have complex nested layouts
- ✅ You want precise control over the connection point

You **don't need** `connectionRef` when:
- ❌ Using the default tooltip
- ❌ Your custom tooltip has no padding
- ❌ The default connection point works fine

---

## Examples

### Example 1: Disable LeaderLine

```tsx
<TourGuideProvider
  leaderLineConfig={{ enabled: false }}
>
  {/* No lines will be drawn */}
</TourGuideProvider>
```

### Example 2: Custom Colors per Step

```tsx
<>
  <TourGuideZone
    zone={1}
    text="Step 1"
    leaderLineConfig={{
      color: '#4CAF50',
      endPlugColor: '#4CAF50',
    }}
  >
    <View />
  </TourGuideZone>

  <TourGuideZone
    zone={2}
    text="Step 2"
    leaderLineConfig={{
      color: '#2196F3',
      endPlugColor: '#2196F3',
    }}
  >
    <View />
  </TourGuideZone>
</>
```

### Example 3: Curved Line with Disc

```tsx
<TourGuideZone
  zone={1}
  text="Beautiful curved line"
  leaderLineConfig={{
    path: 'fluid',
    startPlug: 'disc',
    endPlug: 'arrow2',
    size: 5,
    color: '#FF6B6B',
    endPlugColor: '#FF6B6B',
  }}
>
  <View />
</TourGuideZone>
```

### Example 4: Dashed Line

```tsx
<TourGuideZone
  zone={1}
  text="Dashed connector"
  leaderLineConfig={{
    dash: { pattern: '10,5', animation: true },
    color: 'white',
  }}
>
  <View />
</TourGuideZone>
```

### Example 5: Line with Drop Shadow

```tsx
<TourGuideZone
  zone={1}
  text="Line with shadow"
  leaderLineConfig={{
    dropShadow: {
      dx: 2,
      dy: 2,
      blur: 4,
      color: 'rgba(0,0,0,0.3)',
    },
  }}
>
  <View />
</TourGuideZone>
```

### Example 6: Different Socket Positions

```tsx
<TourGuideZone
  zone={1}
  text="Connect top of tooltip to bottom of element"
  leaderLineConfig={{
    startSocket: 'top',     // Top of tooltip
    endSocket: 'bottom',    // Bottom of element
  }}
>
  <View />
</TourGuideZone>
```

---

## TypeScript Support

All LeaderLine options are fully typed. Import the types if needed:

```tsx
import type { LeaderLineConfig } from 'rn-tourguide-enhanced';

const config: LeaderLineConfig = {
  color: 'white',
  size: 4,
  // TypeScript will autocomplete and validate
};
```

---

## Troubleshooting

### Line not appearing

1. Check that `enabled: true` (default)
2. Verify both tooltip and highlighted element are visible
3. Check console for warnings
4. Ensure `containerRef` is set on the Modal (automatic in most cases)

### Line connects to wrong point

- Use `startSocket` and `endSocket` to specify exact positions
- For custom tooltips, use `connectionRef` to control the connection point

### Line has wrong color

- Set both `color` and `endPlugColor` to the same value
- Check that parent configurations aren't overriding your settings

### Performance issues

- Use `path: 'straight'` for best performance
- Reduce `size` if rendering many lines
- Consider disabling drop shadows and gradients

---

## Migration from Earlier Versions

If you were using LeaderLine before the `connectionRef` feature:

**Before:**
```tsx
// Lines might have gaps due to tooltip padding
<TourGuideProvider tooltipComponent={CustomTooltip} />
```

**After:**
```tsx
// Now you can eliminate gaps with connectionRef
function CustomTooltip({ connectionRef, ...props }: TooltipProps) {
  return (
    <View style={{ padding: 20 }}>
      <View ref={connectionRef}>
        {/* content */}
      </View>
    </View>
  );
}
```

---

## Credits

LeaderLine integration powered by [react-native-leader-line](https://github.com/your-repo/react-native-leader-line).

For more advanced use cases and complete API reference, see the [react-native-leader-line documentation](https://github.com/your-repo/react-native-leader-line).
