import * as React from 'react'
import { StyleProp, Text, View, ViewStyle } from 'react-native'
import {
  BorderRadiusObject,
  LeaderLineConfig,
  MaskOffset,
  Shape,
  TooltipPosition,
} from '../types'
import { Step } from './Step'
import { Wrapper } from './Wrapper'

// Import LeaderLine igual que en Modal.tsx
import type { PlugType } from 'react-native-leader-line'
import { createLeaderLine } from 'react-native-leader-line'

// Componente de test simple para LeaderLine
const SimpleLeaderLineTest: React.FC<{
  leaderLineConfig?: LeaderLineConfig
}> = ({ leaderLineConfig }) => {
  const sourceRef = React.useRef<any>(null)
  const targetRef = React.useRef<any>(null)
  const leaderLineRef = React.useRef<any>(null)

  React.useEffect(() => {
    // Esperar a que los componentes se monten
    setTimeout(() => {
      createTestLeaderLine()
    }, 500)

    return () => {
      if (leaderLineRef.current) {
        try {
          leaderLineRef.current.remove()
        } catch (error) {
          // Error removiendo LeaderLine
        }
      }
    }
  }, [])

  const createTestLeaderLine = () => {
    if (!createLeaderLine) {
      return
    }

    if (!sourceRef.current || !targetRef.current) {
      return
    }

    try {
      const sourceElement = sourceRef.current
      const targetElement = targetRef.current

      // Configuración detallada
      const rawConfig = {
        enabled: true,
        color: '#FF0000',
        size: 8,
        startPlug: 'disc' as PlugType,
        endPlug: 'arrow1' as PlugType,
        ...leaderLineConfig,
      }

      const { enabled, ...leaderLineOptions } = rawConfig

      // Crear LeaderLine
      let leaderLine: any = null

      try {
        leaderLine = createLeaderLine(
          sourceElement,
          targetElement,
          leaderLineOptions,
        )
      } catch (createError: any) {
        throw createError
      }

      leaderLineRef.current = leaderLine

      // Ejecutar métodos
      if (leaderLine) {
        try {
          const showResult = leaderLine.show()

          // CRÍTICO: Verificar si component es null
          if (showResult?.component === null) {
            // Estrategia 1: Forzar renderizado múltiples veces
            setTimeout(() => {
              leaderLine.position()
              leaderLine.show()
            }, 50)

            setTimeout(() => {
              leaderLine.position()
              leaderLine.show()

              // Verificar resultado después del forzado
              const secondResult = leaderLine.show()

              // Estrategia 2: Si sigue null, recrear LeaderLine
              if (secondResult?.component === null) {
                setTimeout(() => {
                  try {
                    leaderLine.remove()

                    const newLeaderLine = createLeaderLine(
                      sourceElement,
                      targetElement,
                      {
                        ...leaderLineOptions,
                        // Intentar configuración más simple
                        startPlug: 'behind',
                        endPlug: 'behind',
                        hide: false,
                      },
                    )

                    leaderLineRef.current = newLeaderLine
                    newLeaderLine.show()
                  } catch (recreateError) {
                    // Error recreando
                  }
                }, 200)
              }
            }, 150)
          }
        } catch (showError) {
          // Error en show
        }

        setTimeout(() => {
          try {
            leaderLine.show()
            leaderLine.position()
          } catch (posError) {
            // Error en position
          }
        }, 100)

        setTimeout(() => {
          try {
            leaderLine.show()
            leaderLine.position()
          } catch (finalError) {
            // Error en show/position final
          }
        }, 500)

        // Verificar estado después de 1 segundo
        setTimeout(() => {
          try {
            if (leaderLineRef.current) {
              leaderLineRef.current.position()
            }
          } catch (stateError) {
            // Error verificando estado
          }
        }, 1000)
      }
    } catch (error: any) {
      // Error general creando LeaderLine
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
  tooltipPosition?: TooltipPosition
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
  tooltipPosition,
  borderRadiusObject,
  leaderLineConfig,
  testLeaderLine = false,
}: TourGuideZoneProps) => {
  // Si testLeaderLine está activado, mostrar el test simple
  if (testLeaderLine) {
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
        tooltipPosition,
        borderRadiusObject,
        leaderLineConfig,
      }}
    >
      <Wrapper {...{ style }}>{children}</Wrapper>
    </Step>
  )
}
