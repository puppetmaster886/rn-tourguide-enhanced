import * as React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import {
  BorderRadiusObject,
  LeaderLineConfig,
  MaskOffset,
  Shape,
} from '../types'
import { Step } from './Step'
import { Wrapper } from './Wrapper'

// Import LeaderLine igual que en Modal.tsx
import type { PlugType } from 'react-native-leader-line'
import { createLeaderLine } from 'react-native-leader-line'

// Debug version para verificar que está usando la versión correcta
const DEBUG_VERSION_ZONE = 'v2.4.3-RECREATE-FIX'
console.log(
  `🧪 ===== TOURGUIDE ZONE VERSION ${DEBUG_VERSION_ZONE} LOADED ===== 🧪`,
)

// Componente de test simple para LeaderLine
const SimpleLeaderLineTest: React.FC<{
  leaderLineConfig?: LeaderLineConfig
}> = ({ leaderLineConfig }) => {
  const sourceRef = React.useRef<any>(null)
  const targetRef = React.useRef<any>(null)
  const leaderLineRef = React.useRef<any>(null)

  React.useEffect(() => {
    console.log(
      '🧪 [TourGuideZone-Test] Iniciando test simple de LeaderLine...',
    )

    // Esperar a que los componentes se monten
    setTimeout(() => {
      createTestLeaderLine()
    }, 500)

    return () => {
      if (leaderLineRef.current) {
        try {
          leaderLineRef.current.remove()
          console.log('🧪 [TourGuideZone-Test] LeaderLine removido')
        } catch (error) {
          console.log(
            '🧪 [TourGuideZone-Test] Error removiendo LeaderLine:',
            error,
          )
        }
      }
    }
  }, [])

  const createTestLeaderLine = () => {
    console.log('🧪 [TourGuideZone-Test] createTestLeaderLine llamado')

    // DEBUG 1: Verificar disponibilidad de createLeaderLine
    console.log(
      '🔍 [DEBUG-1] createLeaderLine disponible:',
      typeof createLeaderLine,
    )
    console.log(
      '🔍 [DEBUG-1] createLeaderLine es función:',
      typeof createLeaderLine === 'function',
    )

    if (!createLeaderLine) {
      console.log('❌ [TourGuideZone-Test] createLeaderLine no está disponible')
      return
    }

    // DEBUG 2: Verificar referencias
    console.log('🔍 [DEBUG-2] sourceRef.current:', !!sourceRef.current)
    console.log('🔍 [DEBUG-2] targetRef.current:', !!targetRef.current)
    console.log('🔍 [DEBUG-2] sourceRef tipo:', typeof sourceRef.current)
    console.log('🔍 [DEBUG-2] targetRef tipo:', typeof targetRef.current)

    if (!sourceRef.current || !targetRef.current) {
      console.log('❌ [TourGuideZone-Test] Referencias no disponibles')
      return
    }

    try {
      const sourceElement = sourceRef.current
      const targetElement = targetRef.current

      // DEBUG 3: Verificar elementos
      console.log('🔍 [DEBUG-3] sourceElement válido:', !!sourceElement)
      console.log('🔍 [DEBUG-3] targetElement válido:', !!targetElement)
      console.log('🔍 [DEBUG-3] sourceElement methods:', {
        measure: typeof sourceElement.measure,
        measureInWindow: typeof sourceElement.measureInWindow,
      })

      // DEBUG 4: Medir posiciones de elementos
      if (sourceElement.measure) {
        sourceElement.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number,
          ) => {
            console.log('🔍 [DEBUG-4] Source position:', {
              x,
              y,
              width,
              height,
              pageX,
              pageY,
            })
          },
        )
      }

      if (targetElement.measure) {
        targetElement.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number,
          ) => {
            console.log('🔍 [DEBUG-4] Target position:', {
              x,
              y,
              width,
              height,
              pageX,
              pageY,
            })
          },
        )
      }

      // DEBUG 5: Configuración detallada
      const rawConfig = {
        enabled: true,
        color: '#FF0000',
        size: 8,
        startPlug: 'disc' as PlugType,
        endPlug: 'arrow1' as PlugType,
        ...leaderLineConfig,
      }

      console.log('🔍 [DEBUG-5] Configuración raw:', rawConfig)

      const { enabled, ...leaderLineOptions } = rawConfig
      console.log(
        '🔍 [DEBUG-5] Configuración final leaderLineOptions:',
        leaderLineOptions,
      )
      console.log('🔍 [DEBUG-5] enabled removido:', enabled)

      console.log(
        '🧪 [TourGuideZone-Test] Creando LeaderLine con config:',
        leaderLineOptions,
      )

      // DEBUG 6: Crear LeaderLine con try/catch detallado
      let leaderLine: any = null

      console.log('🔍 [DEBUG-6] Intentando crear LeaderLine...')
      console.log('🔍 [DEBUG-6] Parámetros:', {
        sourceElement: !!sourceElement,
        targetElement: !!targetElement,
        options: leaderLineOptions,
      })

      try {
        leaderLine = createLeaderLine(
          sourceElement,
          targetElement,
          leaderLineOptions,
        )
        console.log('🔍 [DEBUG-6] LeaderLine creado sin errores')
      } catch (createError: any) {
        console.log(
          '❌ [DEBUG-6] Error específico en createLeaderLine:',
          createError,
        )
        console.log('❌ [DEBUG-6] Error name:', createError?.name)
        console.log('❌ [DEBUG-6] Error message:', createError?.message)
        throw createError
      }

      // DEBUG 7: Verificar objeto LeaderLine
      console.log('🔍 [DEBUG-7] LeaderLine objeto válido:', !!leaderLine)
      console.log('🔍 [DEBUG-7] LeaderLine tipo:', typeof leaderLine)

      if (leaderLine) {
        console.log('🔍 [DEBUG-7] LeaderLine methods disponibles:', {
          show: typeof leaderLine.show,
          hide: typeof leaderLine.hide,
          position: typeof leaderLine.position,
          remove: typeof leaderLine.remove,
          setOptions: typeof leaderLine.setOptions,
        })

        console.log(
          '🔍 [DEBUG-7] LeaderLine propiedades:',
          Object.keys(leaderLine),
        )
      }

      leaderLineRef.current = leaderLine

      console.log('✅ [TourGuideZone-Test] LeaderLine creado exitosamente')

      // DEBUG 8: Ejecutar métodos con logging detallado
      if (leaderLine) {
        console.log('🔍 [DEBUG-8] Ejecutando show() inicial...')
        try {
          const showResult = leaderLine.show()
          console.log('🔍 [DEBUG-8] show() resultado:', showResult)

          // CRÍTICO: Verificar si component es null
          if (showResult?.component === null) {
            console.log(
              '🚨 [DEBUG-8] PROBLEMA DETECTADO: component es null - forzando render...',
            )

            // Estrategia 1: Forzar renderizado múltiples veces
            setTimeout(() => {
              console.log('🔧 [DEBUG-8] Forzando render #1...')
              leaderLine.position()
              leaderLine.show()
            }, 50)

            setTimeout(() => {
              console.log('🔧 [DEBUG-8] Forzando render #2...')
              leaderLine.position()
              leaderLine.show()

              // Verificar resultado después del forzado
              const secondResult = leaderLine.show()
              console.log(
                '🔧 [DEBUG-8] Resultado después de forzar:',
                secondResult,
              )
              
              // Estrategia 2: Si sigue null, recrear LeaderLine
              if (secondResult?.component === null) {
                console.log('🔧 [DEBUG-8] Component aún null, recreando LeaderLine...')
                
                setTimeout(() => {
                  try {
                    console.log('🔧 [DEBUG-8] Removiendo LeaderLine anterior...')
                    leaderLine.remove()
                    
                    console.log('🔧 [DEBUG-8] Creando nuevo LeaderLine...')
                    const newLeaderLine = createLeaderLine(
                      sourceElement,
                      targetElement,
                      {
                        ...leaderLineOptions,
                        // Intentar configuración más simple
                        startPlug: 'behind',
                        endPlug: 'behind',
                        hide: false,
                      }
                    )
                    
                    leaderLineRef.current = newLeaderLine
                    console.log('🔧 [DEBUG-8] Nuevo LeaderLine creado')
                    
                    const newResult = newLeaderLine.show()
                    console.log('🔧 [DEBUG-8] Nuevo resultado:', newResult)
                    
                  } catch (recreateError) {
                    console.log('❌ [DEBUG-8] Error recreando:', recreateError)
                  }
                }, 200)
              }
            }, 150)
          }
        } catch (showError) {
          console.log('❌ [DEBUG-8] Error en show():', showError)
        }

        setTimeout(() => {
          console.log(
            '🔍 [DEBUG-8] Ejecutando show() + position() después de 100ms...',
          )
          try {
            leaderLine.show()
            const positionResult = leaderLine.position()
            console.log('🔍 [DEBUG-8] position() resultado:', positionResult)
          } catch (posError) {
            console.log('❌ [DEBUG-8] Error en position():', posError)
          }
        }, 100)

        setTimeout(() => {
          console.log(
            '🔍 [DEBUG-8] Ejecutando show() final después de 500ms...',
          )
          try {
            leaderLine.show()
            leaderLine.position()
            console.log('🔍 [DEBUG-8] Show/position final completado')
          } catch (finalError) {
            console.log(
              '❌ [DEBUG-8] Error en show/position final:',
              finalError,
            )
          }
        }, 500)

        // DEBUG 9: Verificar estado después de 1 segundo
        setTimeout(() => {
          console.log('🔍 [DEBUG-9] Estado LeaderLine después de 1s:')
          console.log(
            '🔍 [DEBUG-9] Objeto aún válido:',
            !!leaderLineRef.current,
          )

          try {
            if (leaderLineRef.current) {
              console.log(
                '🔍 [DEBUG-9] Llamando position() para verificar estado...',
              )
              leaderLineRef.current.position()
              console.log(
                '🔍 [DEBUG-9] position() exitoso - LeaderLine funcional',
              )
            }
          } catch (stateError) {
            console.log('❌ [DEBUG-9] Error verificando estado:', stateError)
          }
        }, 1000)
      }
    } catch (error: any) {
      console.log(
        '❌ [TourGuideZone-Test] Error general creando LeaderLine:',
        error,
      )
      console.log('❌ [ERROR] Error name:', error?.name)
      console.log('❌ [ERROR] Error message:', error?.message)
      console.log('❌ [ERROR] Error stack:', error?.stack)
    }
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#f0f0f0' }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 30,
        }}
      >
        Test Simple LeaderLine
      </Text>

      <View
        ref={sourceRef}
        style={{
          position: 'absolute',
          top: 100,
          left: 50,
          width: 100,
          height: 60,
          backgroundColor: '#4CAF50',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>ORIGEN</Text>
      </View>

      <View
        ref={targetRef}
        style={{
          position: 'absolute',
          top: 300,
          right: 50,
          width: 100,
          height: 60,
          backgroundColor: '#2196F3',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>DESTINO</Text>
      </View>

      <Text
        style={{
          position: 'absolute',
          bottom: 100,
          left: 20,
          right: 20,
          textAlign: 'center',
          fontSize: 14,
          fontStyle: 'italic',
          color: '#666',
        }}
      >
        Deberías ver una flecha roja conectando ORIGEN con DESTINO
      </Text>
    </View>
  )
}

export interface TourGuideZoneProps {
  zone: number
  tourKey?: string
  isTourGuide?: boolean
  text?: string
  shape?: Shape
  maskOffset?: MaskOffset
  borderRadius?: number
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  tooltipLeftOffset?: number
  borderRadiusObject?: BorderRadiusObject
  leaderLineConfig?: LeaderLineConfig
  // Nueva prop para test simple
  testLeaderLine?: boolean
}

export const TourGuideZone = ({
  isTourGuide = true,
  tourKey = '_default',
  zone,
  children,
  shape,
  text,
  maskOffset,
  borderRadius,
  style,
  keepTooltipPosition,
  tooltipBottomOffset,
  tooltipLeftOffset,
  borderRadiusObject,
  leaderLineConfig,
  testLeaderLine = false,
}: TourGuideZoneProps) => {
  // Si testLeaderLine está activado, mostrar el test simple
  if (testLeaderLine) {
    console.log(
      '🧪 [TourGuideZone] Modo test activado, mostrando SimpleLeaderLineTest',
    )
    return <SimpleLeaderLineTest leaderLineConfig={leaderLineConfig} />
  }

  if (!isTourGuide) {
    return <>{children}</>
  }

  return (
    <Step
      text={text ?? `Zone ${zone}`}
      order={zone}
      name={`${zone}`}
      {...{
        tourKey,
        shape,
        maskOffset,
        borderRadius,
        keepTooltipPosition,
        tooltipBottomOffset,
        tooltipLeftOffset,
        borderRadiusObject,
        leaderLineConfig,
      }}
    >
      <Wrapper {...{ style }}>{children}</Wrapper>
    </Step>
  )
}
