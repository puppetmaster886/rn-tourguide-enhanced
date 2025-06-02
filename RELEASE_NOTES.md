# RN-TourGuide v3.4.0 Release Notes

## 🎉 Major Feature Release

We're excited to announce RN-TourGuide v3.4.0, a comprehensive update that integrates 8 pending Pull Requests from the community, bringing significant improvements and new features to the library.

## 🆕 What's New

### ScrollView Support (PR #112)

Tour guides now work seamlessly inside ScrollView components with automatic scrolling to tour steps.

```typescript
const { start } = useTourGuideController()
const scrollRef = React.useRef(null)

// Automatically scrolls to tour steps
start(1, scrollRef)
```

### Persistent Tooltips (PR #79)

Keep tooltips visible during step transitions for a smoother user experience.

```typescript
<TourGuideProvider persistTooltip={true}>
  <AppContent />
</TourGuideProvider>
```

### Custom Tooltip Positioning (PR #110)

Precise control over tooltip positioning with new offset props.

```typescript
<TourGuideZone zone={1} tooltipLeftOffset={50} tooltipBottomOffset={100}>
  <Button title='Custom positioning' />
</TourGuideZone>
```

### Enhanced Mask Offset (PR #61)

Support for directional mask offsets for precise highlighting.

```typescript
<TourGuideZone
  zone={1}
  maskOffset={{ top: 20, bottom: 15, left: 10, right: 25 }}
>
  <Button title='Directional offsets' />
</TourGuideZone>
```

## 🐛 Bug Fixes

- **SVG Mask Resize (PR #82)**: Fixed broken SVG mask on screen resize for web and mobile
- **Landscape Modal (PR #104)**: Fixed right margin issues in landscape orientation
- **Cross-Platform**: Improved Android StatusBar handling and web compatibility

## 🔒 Security Updates

- **ua-parser-js**: Updated from 0.7.28 to 0.7.33 (PR #131)
- **minimatch**: Updated from 3.0.4 to 3.1.2 (PR #130)

## 🔄 Backward Compatibility

This release maintains 100% backward compatibility:

- All existing APIs work unchanged
- Traditional `maskOffset` number values continue to work
- No breaking changes introduced

## 📊 Testing

- **28 tests passing** (increased from 17)
- Added comprehensive test suites for all new features
- TypeScript compilation verified

## 🙏 Acknowledgments

Special thanks to:

- **Xavier Carpentier** - Original creator and maintainer of rn-tourguide
- **Community Contributors** - Authors of the integrated Pull Requests:
  - ScrollView support implementation
  - PersistTooltip feature
  - Custom tooltip positioning
  - Enhanced mask offset functionality
  - Cross-platform bug fixes
  - Security dependency updates

## 🚀 Upgrade Guide

### From v3.3.x

Simply update your dependency:

```bash
yarn add rn-tourguide@3.4.0
# or
npm install rn-tourguide@3.4.0
```

### New Optional Features

You can immediately start using the new features:

```typescript
// ScrollView support
const AppContent = () => {
  const scrollRef = React.useRef(null)
  const { start, canStart } = useTourGuideController()

  React.useEffect(() => {
    if (canStart) {
      start(1, scrollRef) // Pass scroll reference
    }
  }, [canStart])

  return (
    <ScrollView ref={scrollRef}>
      <TourGuideZone
        zone={1}
        persistTooltip={true}
        tooltipLeftOffset={50}
        maskOffset={{ top: 10, left: 5 }}
      >
        <YourComponent />
      </TourGuideZone>
    </ScrollView>
  )
}
```

## 📖 Documentation

- Updated README.md with comprehensive examples
- Added CHANGELOG.md with detailed change history
- All new features documented with TypeScript interfaces

## 🔗 Links

- [GitHub Repository](https://github.com/xcarpentier/rn-tourguide)
- [NPM Package](https://www.npmjs.com/package/rn-tourguide)
- [Demo](https://xcarpentier.github.io/rn-tourguide/)

---

**Released**: June 2, 2025  
**Integrated by**: Federico Garcia  
**Based on**: rn-tourguide by Xavier Carpentier
