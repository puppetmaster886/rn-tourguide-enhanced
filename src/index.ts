// 🔍 DEBUG: Logs de exportación principal
console.log('📦 rn-tourguide-enhanced: Iniciando exportaciones...')

export { Modal } from './components/Modal'
export { SvgMask } from './components/SvgMask'
export { Tooltip } from './components/Tooltip'
export type { TooltipProps } from './components/Tooltip'
export { TourGuideContext } from './components/TourGuideContext'
export type { ITourGuideContext } from './components/TourGuideContext'
export { TourGuideProvider } from './components/TourGuideProvider'
export type { TourGuideProviderProps } from './components/TourGuideProvider'
export { TourGuideZone } from './components/TourGuideZone'
export type { TourGuideZoneProps } from './components/TourGuideZone'
export { TourGuideZoneByPosition } from './components/TourGuideZoneByPosition'
export type { TourGuideZoneByPositionProps } from './components/TourGuideZoneByPosition'
export { useTourGuideController } from './hooks/useTourGuideController'
export * from './types'

// 🔍 DEBUG: Verificación de exportaciones
console.log('📦 rn-tourguide-enhanced: Exportaciones completadas')
console.log(
  '📦 rn-tourguide-enhanced: Componentes disponibles: Modal, SvgMask, Tooltip, TourGuideProvider, etc.',
)
