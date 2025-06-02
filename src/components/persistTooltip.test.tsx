import * as React from 'react'
import renderer from 'react-test-renderer'
import { TourGuideProvider } from './TourGuideProvider'

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

// Simple mock for Modal component
jest.mock('./Modal', () => ({
  Modal: jest.fn(() => null),
}))

// Mock other components to avoid complex rendering
jest.mock('./TourGuideZone', () => ({
  TourGuideZone: jest.fn(({ children }) => children),
}))

describe('PR #79 - persistTooltip functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should render TourGuideProvider with persistTooltip prop defined in interface', () => {
    // This test verifies that persistTooltip can be passed without TypeScript errors
    expect(() => {
      renderer.create(
        <TourGuideProvider persistTooltip={true}>
          <div>Test content</div>
        </TourGuideProvider>,
      )
    }).not.toThrow()
  })

  test('should render TourGuideProvider with persistTooltip=false', () => {
    expect(() => {
      renderer.create(
        <TourGuideProvider persistTooltip={false}>
          <div>Test content</div>
        </TourGuideProvider>,
      )
    }).not.toThrow()
  })

  test('should render TourGuideProvider without persistTooltip prop (default behavior)', () => {
    expect(() => {
      renderer.create(
        <TourGuideProvider>
          <div>Test content</div>
        </TourGuideProvider>,
      )
    }).not.toThrow()
  })

  test('persistTooltip should be optional in TourGuideProviderProps interface', () => {
    // Test that the interface accepts both with and without the prop
    const withProp = () => (
      <TourGuideProvider persistTooltip={true}>
        <div>content</div>
      </TourGuideProvider>
    )

    const withoutProp = () => (
      <TourGuideProvider>
        <div>content</div>
      </TourGuideProvider>
    )

    // Both should compile without TypeScript errors
    expect(withProp).toBeDefined()
    expect(withoutProp).toBeDefined()
  })

  test('should accept true and false values for persistTooltip', () => {
    const testCases = [true, false, undefined]

    testCases.forEach((persistTooltipValue) => {
      expect(() => {
        renderer.create(
          <TourGuideProvider persistTooltip={persistTooltipValue}>
            <div>content</div>
          </TourGuideProvider>,
        )
      }).not.toThrow()
    })
  })
})
