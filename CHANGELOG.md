# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.8.1] - 2025-11-17

### Fixed

- **Android Offset Regression:** Reverted the automatic subtraction on Android so highlights no longer jump upward; the library only subtracts `StatusBar.currentHeight` when you explicitly opt in via `statusBarOffset` or the legacy `androidStatusBarVisible={false}`.

## [3.8.0] - 2025-11-17

### Fixed

- **Safe Area Alignment:** Automatically subtract the appropriate status bar / safe-area inset on iOS and Android so highlights align with their targets without any extra configuration.

### Added

- **`statusBarOffset` Override:** New optional `statusBarOffset` prop that lets apps supply a custom offset when the automatic detection does not match bespoke layouts. The legacy `androidStatusBarVisible` prop is now deprecated in favor of this cross-platform control.
- **Safe Area Peer Dependency:** Added `react-native-safe-area-context` as a peer dependency to formalize the new behavior.

## [3.7.1] - 2025-11-13

### Fixed

- **LeaderLine Positioning:** Improved LeaderLine positioning by adding explicit positioning and z-index styles to the LeaderLine container, ensuring proper layering and preventing layout issues.

## [3.7.0] - 2025-11-13

### Added

- **Tour Key Visibility:** `currentStep` objects passed to custom tooltips now include `tourKey`, which means tooltips can tailor copy, analytics, or styling based on the active tour without additional props wiring.

### Fixed

- **Lifecycle Parity:** Emitted the `'stop'` event whenever a tour ends (finish, dismiss, or manual stop) so `eventEmitter.on('stop', …)` callbacks reliably run and persisters can mark tours as completed.
- **Tooltip Interactions with LeaderLine:** LeaderLine now renders beneath the tooltip and ignores pointer events, preventing the connector from blocking button taps in dense layouts.

## [3.6.6] - 2025-10-22

### Added

- **LeaderLine Configuration**: Extended `leaderLineConfig` with new performance and styling options
  - `style?: ViewStyle` - Custom container styles for the leader line
  - `optimizeUpdates?: boolean` - Whether to optimize updates for better performance (default: true)
  - `updateThreshold?: number` - Minimum pixel change to trigger update (default: 5)
  - `smoothAnimations?: boolean` - Enable smooth interpolation for animations (default: false)

### Documentation

- Updated `docs/leader-line.md` with comprehensive documentation for new parameters
  - Added "Performance & Animation Options" section with detailed parameter descriptions
  - Added Example 7 showing usage of performance and animation options
  - All options are fully typed and integrated with existing LeaderLine configuration system

## [3.6.5] - 2025-10-22

### Added

- **Multiple Controllers Support**: Multiple components can now use `useTourGuideController` with the same `tourKey` without conflicts
  - Eliminated global `tourKey` state that caused race conditions
  - Introduced `activeTourKey` state to track which tour is currently visible
  - Each controller instance can independently control the same tour
  - Useful for having tour controls in different parts of the UI (header, sidebar, modals, etc.)

### Changed

- **Flexible tourKey Assignment**: Enhanced `KeyedTourGuideZone` and `KeyedTourGuideZoneByPosition` components

  - `tourKey` prop is now **optional** instead of omitted from the component signature
  - Allows mixing hook-level tourKey with zone-level overrides
  - Pattern: `<TourGuideZone tourKey={zoneTourKey ?? hookTourKey}>`
  - Supports these usage patterns:
    1. Hook without tourKey + zone with tourKey
    2. Hook with tourKey + zone without tourKey (uses hook's key)
    3. Hook with tourKey + zone with different tourKey (override)
    4. Hook without tourKey + zone without tourKey (uses default)

- **Removed `setTourKey` from Context**: Simplified tour state management
  - Removed `setTourKey` from `ITourGuideContext` interface
  - Removed `setTourKey` function from `TourGuideProvider`
  - Removed `useEffect` in `useTourGuideController` that called `setTourKey`
  - Tours are now managed purely through the `visible` state and `activeTourKey`

### Fixed

- **Backdrop Not Showing on First Step**: Fixed missing initial animation for backdrop
  - Added `componentDidMount` to `SvgMask` component
  - Ensures opacity animation runs when the mask first appears
  - Backdrop now correctly fades in from the start of the tour

### Technical Details

**State Management Changes:**

- Replaced singular `tourKey` state with `activeTourKey` that tracks which tour is currently being displayed
- `activeTourKey` is automatically updated when `setVisible()` is called
- Modal receives tour data via `activeTourKey` instead of a global shared state
- Prevents multiple hooks from competing to update the same state value

**tourKey Precedence:**
The library now supports maximum flexibility for tourKey assignment:

```typescript
// Zone-level tourKey takes precedence over hook-level
const { TourGuideZone } = useTourGuideController('onboarding')
<TourGuideZone tourKey="advanced" />  // Uses 'advanced', not 'onboarding'
```

**Breaking Changes:** None - all existing code continues to work as before. These changes are purely additive and fix existing bugs.

### Documentation

- Updated [API Reference](./docs/api-reference.md) with comprehensive multiple tours documentation
  - 5 different usage patterns for tourKey management
  - Examples of multiple controllers controlling the same tour
  - Clear explanation of tourKey precedence rules
- Updated [README.md](./README.md) with new "Flexible Tour Management" section
- Added code examples showing multiple components controlling the same tour

## [3.6.4] - 2025-10-21

### Fixed

- **ConnectedStep**: Fixed borderRadius inconsistent behavior between zone and provider
  - Removed measurement adjustments based on borderRadius in ConnectedStep.tsx
  - borderRadius now only affects visual mask rendering, not element measurements
  - Ensures consistent behavior: zone parameters properly override provider parameters
  - Parameter precedence is now correctly applied: zone > provider > default

### Technical Details

Previously, when `borderRadius` was set on a TourGuideZone, the `measure()` method in ConnectedStep was adjusting the element's x-coordinate and width (`x + borderRadius`, `width - borderRadius * 2`). This caused different behavior compared to when `borderRadius` was set on the provider. Now, `borderRadius` only affects the SVG mask rendering in SvgMask.tsx, ensuring consistent behavior regardless of where parameters are configured.

All configurable parameters (`borderRadius`, `maskOffset`, `borderRadiusObject`, `tooltipPosition`, `leaderLineConfig`, etc.) now follow the correct precedence order consistently.

## [3.6.3] - 2025-10-21

### Changed

- **README**: Updated demo GIF to display correctly on npm
  - Replaced `demo-recording.gif` with new `demo.gif`
  - Changed image URL to GitHub raw URL format for npm compatibility
  - Now using: `https://raw.githubusercontent.com/puppetmaster886/rn-tourguide-enhanced/main/demo.gif`
  - This ensures the demo GIF displays correctly on both GitHub and npm package page

### Technical Details

npm requires absolute URLs for images in README files. Using relative paths (like `./demo.gif`) works on GitHub but fails on npm due to CORS restrictions. The GitHub raw URL format (`raw.githubusercontent.com`) is the standard solution for displaying images in npm package READMEs.

## [3.6.2] - 2025-10-21

### Changed

- **Documentation**: Complete reorganization following npm 2025 best practices
  - Created `/docs` directory with organized documentation structure
  - New comprehensive guides:
    - `docs/installation.md` - Complete installation and setup guide
    - `docs/api-reference.md` - Full API documentation with TypeScript types
    - `docs/contributing.md` - Development and contribution guide (formerly DEVELOPMENT.md)
    - `docs/leader-line.md` - LeaderLine customization guide (formerly LEADER_LINE.md)
  - New example documentation:
    - `docs/examples/custom-tooltip.md` - Custom tooltip implementation (formerly CUSTOM_TOOLTIP_DATA_EXAMPLE.md)
    - `docs/examples/scrollview-support.md` - ScrollView integration examples
  - Simplified README.md to focus on overview and quick start with clear links to detailed docs
  - Removed obsolete internal documentation files (INTEGRATION_TASKS.md, RELEASE_NOTES.md, GEMINI.md)

### Benefits

- Documentation is now versioned with code and published with npm package
- Better discoverability and organization
- Follows standards used by major projects (React, Vue, Next.js)
- GitHub automatically renders `/docs` directory
- Professional npm package presentation

### Note

This is a documentation-only release with no functional changes to the library.

## [3.6.1] - 2025-10-20

### Fixed

- **Critical Bug**: Fixed CommonJS import compatibility issue in production builds with Hermes
  - Error: "mitt.default is not a function (it is undefined)"
  - Enabled `esModuleInterop: true` in tsconfig.json to generate proper interop helpers
  - TypeScript now generates `__importDefault` helper that correctly wraps CommonJS modules
  - Ensures mitt import works correctly in all React Native environments (Metro, Hermes, JSC)

### Changed

- **TypeScript Configuration**: Added `esModuleInterop: true` to align with React Native best practices
  - Follows @tsconfig/react-native standard configuration
  - Improves compatibility with CommonJS modules
  - No breaking changes for library consumers

### Technical Details

When mitt@3.0.1 exports as `module.exports = function()` without a `.default` property, the previous configuration would generate code that tried to call `mitt_1.default()` which was undefined. With `esModuleInterop: true`, TypeScript generates proper helper functions that wrap CommonJS exports correctly, ensuring `mitt_1.default()` always works.

## [3.6.0] - 2025-10-20

### Fixed

- **Critical Bug**: Fixed runtime error "Cannot read property 'prototype' of undefined" when mitt@3.x is resolved by Metro Bundler
  - Changed all `new mitt()` calls to `mitt()` for correct usage of mitt as a factory function
  - This fix ensures compatibility when other packages in the dependency tree use mitt@3.x
  - Affected locations: `src/components/TourGuideProvider.tsx` (lines 114, 299, 353)

### Changed

- **Dependencies**: Updated `mitt` from ~1.1.3 to ^3.0.1
  - Uses modern event emitter implementation
  - Better performance and TypeScript support
  - Reduces version conflicts in consuming projects

### Compatibility

- Fully backward compatible with existing code
- No API changes for library consumers
- Both mitt@1.x and mitt@3.x usage patterns now supported internally

## [3.5.3] - 2025-10-20

### Changed

- **Dependencies**: Updated `react-native-leader-line` from ^1.6.0 to ^1.7.0
  - Restores compatibility with React Native 0.70.x - 0.73.x
  - Improved cross-version support for broader React Native ecosystem

### Compatibility

- **React Native Support Restored**: Now compatible with React Native >= 0.70.0 (previously required >= 0.74.5)
- **react-native-svg**: Supports versions >= 12.0.0 < 16.0.0 (previously >= 15.2.0)
- Projects using React Native 0.70, 0.71, 0.72, 0.73, and 0.74+ can now use this library

### Documentation

- Added compatibility matrix in README showing version requirements
- Clarified React Native version support in documentation

## [3.5.2] - 2025-10-16

### Changed

- **Dependencies**: Updated `react-native-leader-line` from ^1.6.0 to ^1.7.0
  - Restores compatibility with React Native 0.70.x - 0.73.x
  - Improved cross-version support for broader React Native ecosystem

### Compatibility

- **React Native Support Restored**: Now compatible with React Native >= 0.70.0 (previously required >= 0.74.5)
- **react-native-svg**: Supports versions >= 12.0.0 < 16.0.0 (previously >= 15.2.0)
- Projects using React Native 0.70, 0.71, 0.72, 0.73, and 0.74+ can now use this library

### Documentation

- Added compatibility matrix in README showing version requirements
- Clarified React Native version support in documentation

## [3.5.1] - 2025-10-06

### Changed

- **Code Quality**: Complete codebase cleanup and professionalization
  - Removed all debug and test code from production files
  - Translated all Spanish comments to English for international collaboration
  - Removed SimpleLeaderLineTest debug component
  - Cleaned up empty error handlers and unnecessary comments
  - Fixed unused imports and variables
  - Improved code documentation and clarity

### Fixed

- **TypeScript**: Fixed unused variable warnings in example applications
- **React Hooks**: Fixed missing dependency warnings in useEffect hooks
- **Imports**: Removed unused Text and View imports from TourGuideZone

### Removed

- **Debug Code**: Removed debug timestamps and test components from App.tsx
- **Development Tools**: Removed internal testing utilities from production code

## [3.4.0] - 2025-06-02

### Added

- **ScrollView Support**: Tour guide now works seamlessly inside ScrollViews with automatic scrolling to steps
- **Persistent Tooltips**: New `persistTooltip` prop to keep tooltips visible during step transitions
- **Custom Tooltip Positioning**: Added `tooltipLeftOffset` prop for precise horizontal tooltip positioning
- **Enhanced Mask Offset**: Support for directional mask offsets with `{ top, bottom, left, right }` object format
- **Cross-Platform Improvements**: Better handling of screen resizing on web and mobile
- **Landscape Mode Support**: Improved modal positioning in landscape orientation

### Fixed

- **ScrollView Integration**: Fixed issues when tour guide is used inside ScrollView components
- **SVG Mask Resize**: Fixed broken SVG mask on screen resize for both web and mobile native
- **Landscape Modal Margin**: Fixed right margin issues in landscape orientation
- **Android StatusBar**: Better StatusBar handling with `androidStatusBarVisible` prop

### Security

- **Dependencies**: Updated ua-parser-js from 0.7.28 to 0.7.33 to fix security vulnerabilities
- **Dependencies**: Updated minimatch from 3.0.4 to 3.1.2 to fix security vulnerabilities

### Enhanced API

#### New TourGuideProviderProps

```typescript
interface TourGuideProviderProps {
  // ... existing props
  persistTooltip?: boolean // Keep tooltip visible during step transitions
}
```

#### Enhanced TourGuideZoneProps

```typescript
interface TourGuideZoneProps {
  // ... existing props
  tooltipLeftOffset?: number // Custom horizontal tooltip positioning
  maskOffset?: number | MaskOffsetObject // Enhanced directional mask offsets
}

interface MaskOffsetObject {
  top?: number
  bottom?: number
  left?: number
  right?: number
}
```

#### Enhanced useTourGuideController

```typescript
const { start } = useTourGuideController()
// Now supports scroll reference as second parameter
start(stepNumber, scrollRef)
```

### Backward Compatibility

- All existing APIs remain fully compatible
- Traditional `maskOffset` number values continue to work
- No breaking changes introduced

### Contributors

- Integration and enhancements by Federico Garcia
- Original PRs by various community contributors
- Based on rn-tourguide by Xavier Carpentier

---

## [3.3.2] - Previous Release

- See original repository history for previous changes
