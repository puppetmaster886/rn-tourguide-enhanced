import React, { forwardRef } from 'react'
import { Animated } from 'react-native'
import { Path, PathProps } from 'react-native-svg'

// Create animated component with error handling for multiple versions
let BaseAnimatedPath: any

try {
  BaseAnimatedPath = Animated.createAnimatedComponent(Path)
} catch (error: any) {
  // Fallback for versions that don't support Animated.createAnimatedComponent with SVG
  BaseAnimatedPath = Path
}

// Wrapper component with validation
export const AnimatedSvgPath = forwardRef<any, PathProps>((props, ref) => {
  const { d, ...otherProps } = props

  if (typeof d === 'string') {
    // CRITICAL VALIDATION
    if (d.includes('NaN')) {
      // Return null to prevent crash
      return null
    }
  }

  return <BaseAnimatedPath ref={ref} d={d} {...otherProps} />
})
