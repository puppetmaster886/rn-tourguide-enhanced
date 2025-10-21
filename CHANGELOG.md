# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
