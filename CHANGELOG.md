# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
