import * as React from 'react'
import renderer from 'react-test-renderer'
import { TourGuideProvider } from './TourGuideProvider'
import { TourGuideZone } from './TourGuideZone'

// Mock react-native-leader-line
jest.mock('react-native-leader-line', () => ({
  createLeaderLine: jest.fn(),
  LeaderLine: jest.fn(),
}))

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Path: 'Path',
}))

// Mock mitt
jest.mock('mitt', () => () => ({
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
}))

// Mock react-native components
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Animated: {
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      _value: 0,
    })),
    timing: jest.fn(() => ({ start: jest.fn() })),
    parallel: jest.fn(() => ({ start: jest.fn() })),
    createAnimatedComponent: jest.fn((component) => component),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
    addEventListener: jest.fn(),
  },
  Platform: { OS: 'ios' },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    absoluteFill: {},
    absoluteFillObject: {},
  },
  Pressable: 'Pressable',
  StatusBar: { currentHeight: 20 },
  Easing: { elastic: jest.fn(), linear: jest.fn() },
  findNodeHandle: jest.fn(),
}))

// Mock safe area context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react')
  const insets = { top: 0, bottom: 0, left: 0, right: 0 }
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaInsetsContext: React.createContext(insets),
    useSafeAreaInsets: () => insets,
    initialWindowMetrics: { insets },
  }
})

// Simple mock for Modal component
jest.mock('./Modal', () => ({
  Modal: jest.fn(() => null),
}))

describe('PR #61 - Enhanced maskOffset functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should accept number maskOffset (backward compatibility)', () => {
    expect(() => {
      renderer.create(
        <TourGuideProvider>
          <TourGuideZone zone={1} maskOffset={10}>
            <div>Test content</div>
          </TourGuideZone>
        </TourGuideProvider>,
      )
    }).not.toThrow()
  })

  test('should accept object maskOffset with all directions', () => {
    expect(() => {
      renderer.create(
        <TourGuideProvider>
          <TourGuideZone
            zone={1}
            maskOffset={{ top: 10, bottom: 15, left: 5, right: 20 }}
          >
            <div>Test content</div>
          </TourGuideZone>
        </TourGuideProvider>,
      )
    }).not.toThrow()
  })

  test('should accept object maskOffset with partial directions', () => {
    expect(() => {
      renderer.create(
        <TourGuideProvider>
          <TourGuideZone zone={1} maskOffset={{ top: 10, left: 5 }}>
            <div>Test content</div>
          </TourGuideZone>
        </TourGuideProvider>,
      )
    }).not.toThrow()
  })

  test('should accept undefined maskOffset', () => {
    expect(() => {
      renderer.create(
        <TourGuideProvider>
          <TourGuideZone zone={1}>
            <div>Test content</div>
          </TourGuideZone>
        </TourGuideProvider>,
      )
    }).not.toThrow()
  })

  test('maskOffset should be optional in TourGuideZoneProps interface', () => {
    // Test that the interface accepts both number and object types
    const withNumberMaskOffset = () => (
      <TourGuideZone zone={1} maskOffset={10}>
        <div>content</div>
      </TourGuideZone>
    )

    const withObjectMaskOffset = () => (
      <TourGuideZone
        zone={1}
        maskOffset={{ top: 10, bottom: 15, left: 5, right: 20 }}
      >
        <div>content</div>
      </TourGuideZone>
    )

    const withoutMaskOffset = () => (
      <TourGuideZone zone={1}>
        <div>content</div>
      </TourGuideZone>
    )

    // All should compile without TypeScript errors
    expect(withNumberMaskOffset).toBeDefined()
    expect(withObjectMaskOffset).toBeDefined()
    expect(withoutMaskOffset).toBeDefined()
  })

  test('should handle different combinations of maskOffset values', () => {
    const testCases = [
      undefined,
      10,
      { top: 5 },
      { bottom: 10 },
      { left: 7 },
      { right: 12 },
      { top: 5, bottom: 10 },
      { left: 7, right: 12 },
      { top: 5, bottom: 10, left: 7, right: 12 },
      { top: 0, bottom: 0, left: 0, right: 0 },
    ]

    testCases.forEach((maskOffsetValue, index) => {
      expect(() => {
        renderer.create(
          <TourGuideProvider>
            <TourGuideZone zone={index + 1} maskOffset={maskOffsetValue}>
              <div>content {index}</div>
            </TourGuideZone>
          </TourGuideProvider>,
        )
      }).not.toThrow()
    })
  })
})
