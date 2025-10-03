import React, { forwardRef } from 'react'
import { Animated } from 'react-native'
import { Path, PathProps } from 'react-native-svg'

// Crear componente animado con manejo de errores para múltiples versiones
let BaseAnimatedPath: any

try {
  BaseAnimatedPath = Animated.createAnimatedComponent(Path)
} catch (error: any) {
  // Fallback para versiones que no soporten Animated.createAnimatedComponent con SVG
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
