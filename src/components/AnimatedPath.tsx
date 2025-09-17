import { Animated } from 'react-native'
import { Path } from 'react-native-svg'

// 🔍 DEBUG: Información de importaciones
console.log(
  '🎨 AnimatedPath: react-native importado, Animated:',
  typeof Animated,
)
console.log('🎨 AnimatedPath: react-native-svg importado, Path:', typeof Path)
console.log(
  '🎨 AnimatedPath: Animated.createAnimatedComponent disponible:',
  typeof Animated.createAnimatedComponent,
)

// Crear componente animado con manejo de errores para múltiples versiones
let AnimatedSvgPath: any

try {
  console.log('🎨 AnimatedPath: Intentando crear componente animado...')
  AnimatedSvgPath = Animated.createAnimatedComponent(Path)
  console.log(
    '🎨 AnimatedPath: ✅ Componente animado creado exitosamente:',
    typeof AnimatedSvgPath,
  )
} catch (error: any) {
  console.error('🎨 AnimatedPath: ❌ Error creando componente animado:', error)
  console.error('🎨 AnimatedPath: Error stack:', error?.stack)
  console.warn('🎨 AnimatedPath: Usando fallback Path sin animación')
  // Fallback para versiones que no soporten Animated.createAnimatedComponent con SVG
  AnimatedSvgPath = Path
}

console.log(
  '🎨 AnimatedPath: Exportando AnimatedSvgPath:',
  typeof AnimatedSvgPath,
)

export { AnimatedSvgPath }
