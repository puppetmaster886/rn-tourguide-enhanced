import * as React from 'react'
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import {
  BorderRadiusObject,
  IStep,
  Labels,
  LeaderLineConfig,
  MaskOffset,
  ValueXY,
} from '../types'
import styles, { MARGIN, LEADER_LINE_Z_INDEX, TOOLTIP_Z_INDEX } from './style'
import { SvgMask } from './SvgMask'
import { Tooltip, TooltipProps } from './Tooltip'

declare var __TEST__: boolean

// Import official types and components from react-native-leader-line
import type { PlugType } from 'react-native-leader-line'
import { LeaderLineClass, createLeaderLine } from 'react-native-leader-line'

// DEBUGGING VERSION - NUEVA ESTRATEGIA Z-INDEX SVG CONTEXT FIX
const DEBUG_VERSION = 'v2.5.0-ZINDEX-SVG-FIX'

// Verificar que LeaderLine está disponible y logging inicial
console.log(`🎯 ===== MODAL VERSION ${DEBUG_VERSION} LOADED ===== 🎯`)
console.log(
  `🏹 Modal: [${DEBUG_VERSION}] LeaderLineClass type:`,
  typeof LeaderLineClass,
)
console.log(
  `🏹 Modal: [${DEBUG_VERSION}] createLeaderLine type:`,
  typeof createLeaderLine,
)

try {
  if (typeof createLeaderLine === 'function') {
    console.log(
      `🏹 Modal: [${DEBUG_VERSION}] ✅ createLeaderLine está disponible como función`,
    )
  } else {
    console.error(
      `🏹 Modal: [${DEBUG_VERSION}] ❌ createLeaderLine NO es una función, tipo:`,
      typeof createLeaderLine,
    )
  }
} catch (error) {
  console.error(
    `🏹 Modal: [${DEBUG_VERSION}] ❌ Error al verificar createLeaderLine:`,
    error,
  )
}

declare var __TEST__: boolean

export interface ModalProps {
  ref: any
  currentStep?: IStep
  visible?: boolean
  isFirstStep: boolean
  isLastStep: boolean
  animationDuration?: number
  tooltipComponent: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  maskOffset?: MaskOffset
  borderRadius?: number
  borderRadiusObject?: BorderRadiusObject
  androidStatusBarVisible: boolean
  backdropColor: string
  labels: Labels
  dismissOnPress?: boolean
  easing: (value: number) => number
  stop: () => void
  next: () => void
  prev: () => void
  preventOutsideInteraction?: boolean
  persistTooltip?: boolean
  leaderLineConfig?: LeaderLineConfig
  highlightedElementRef?: React.RefObject<View>
}

interface Layout {
  x?: number
  y?: number
  width?: number
  height?: number
}

interface State {
  isFirstStep: boolean
  isLastStep: boolean
  tooltip: object
  notAnimated?: boolean
  containerVisible: boolean
  layout?: Layout
  size?: ValueXY
  position?: ValueXY
  tooltipTranslateY: Animated.Value
  opacity: Animated.Value
  currentStep?: IStep
}

interface Move {
  top: number
  left: number
  width: number
  height: number
}

export class Modal extends React.Component<ModalProps, State> {
  static defaultProps = {
    easing: Easing.elastic(0.7),
    animationDuration: 400,
    tooltipComponent: Tooltip,
    tooltipStyle: {},
    androidStatusBarVisible: false,
    backdropColor: 'rgba(0, 0, 0, 0.4)',
    labels: {},
    isHorizontal: false,
    preventOutsideInteraction: false,
  }

  layout?: Layout
  private tooltipRef = React.createRef<View>()
  private leaderLineInstance: any = null

  state = {
    isFirstStep: this.props.isFirstStep,
    isLastStep: this.props.isLastStep,
    tooltip: {},
    containerVisible: false,
    tooltipTranslateY: new Animated.Value(0),
    opacity: new Animated.Value(0),
    layout: undefined,
    size: undefined,
    position: undefined,
    currentStep: undefined,
  }

  constructor(props: ModalProps) {
    super(props)
  }

  componentDidUpdate(prevProps: ModalProps) {
    console.log(`🏹 Modal: [${DEBUG_VERSION}] componentDidUpdate() llamado`)
    console.log(
      `🏹 Modal: [${DEBUG_VERSION}] visible cambió de`,
      prevProps.visible,
      'a',
      this.props.visible,
    )

    if (prevProps.visible === true && this.props.visible === false) {
      console.log(`🏹 Modal: [${DEBUG_VERSION}] Modal se ocultó, ejecutando reset...`)
      this.reset()
    }

    // Z-INDEX FIX: Usar !prevProps.visible en lugar de prevProps.visible === false
    if (!prevProps.visible && this.props.visible === true) {
      console.log(
        `🏹 Modal: [${DEBUG_VERSION}] Modal se hizo visible, creando LeaderLine con delay...`,
      )
      setTimeout(() => {
        console.log(
          `🏹 Modal: [${DEBUG_VERSION}] 🕐 Creando LeaderLine después de delay para renderizado completo...`,
        )
        this.createLeaderLine()
      }, 400)
    }

    if (
      prevProps.currentStep !== this.props.currentStep &&
      this.props.visible
    ) {
      console.log(`🏹 Modal: [${DEBUG_VERSION}] Paso cambió y modal es visible, recreando LeaderLine...`)
      setTimeout(() => {
        this.createLeaderLine()
      }, 200)
    }
  }

  handleLayoutChange = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    this.layout = layout
  }

  measure(): Promise<Layout> {
    if (typeof __TEST__ !== 'undefined' && __TEST__) {
      return new Promise((resolve) =>
        resolve({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        }),
      )
    }

    return new Promise((resolve) => {
      const setLayout = () => {
        if (this.layout && this.layout.width !== 0) {
          resolve(this.layout)
        } else {
          requestAnimationFrame(setLayout)
        }
      }
      setLayout()
    })
  }

  async _animateMove(
    obj: Move = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
  ) {
    const layout = await this.measure()
    if (!this.props.androidStatusBarVisible && Platform.OS === 'android') {
      obj.top -= StatusBar.currentHeight || 30
    }

    const center = {
      x: obj.left! + obj.width! / 2,
      y: obj.top! + obj.height! / 2,
    }

    const relativeToLeft = center.x
    const relativeToTop = center.y
    const relativeToBottom = Math.abs(center.y - layout.height!)
    const relativeToRight = Math.abs(center.x - layout.width!)

    const verticalPosition = relativeToBottom > relativeToTop ? 'bottom' : 'top'
    const horizontalPosition =
      relativeToLeft > relativeToRight ? 'left' : 'right'

    const tooltip = {
      top: 0,
      tooltip: 0,
      bottom: 0,
      right: 0,
      maxWidth: 0,
      left: 0,
    }

    if (verticalPosition === 'bottom') {
      tooltip.top = obj.top + obj.height + MARGIN
    } else {
      tooltip.bottom = layout.height! - (obj.top - MARGIN)
    }

    // Apply custom tooltipLeftOffset if provided
    const customLeftOffset = this.props.currentStep?.tooltipLeftOffset

    if (customLeftOffset !== undefined) {
      // When tooltipLeftOffset is provided, use it directly
      tooltip.left = customLeftOffset
      tooltip.maxWidth = layout.width! - tooltip.left - MARGIN
      // Clear right positioning when using custom left
      tooltip.right = 0
    } else {
      // Original logic when no custom left offset is provided
      if (horizontalPosition === 'left') {
        tooltip.right = Math.max(layout.width! - (obj.left + obj.width), 0)
        tooltip.right =
          tooltip.right === 0 ? tooltip.right + MARGIN : tooltip.right
        tooltip.maxWidth = layout.width! - tooltip.right - MARGIN
      } else {
        tooltip.left = Math.max(obj.left, 0)
        tooltip.left = tooltip.left === 0 ? tooltip.left + MARGIN : tooltip.left
        tooltip.maxWidth = layout.width! - tooltip.left - MARGIN
      }
    }

    const duration = this.props.animationDuration! + 200
    const toValue =
      verticalPosition === 'bottom'
        ? tooltip.top
        : obj.top -
          MARGIN -
          135 -
          (this.props.currentStep?.tooltipBottomOffset || 0)
    const translateAnim = Animated.timing(this.state.tooltipTranslateY, {
      toValue,
      duration,
      easing: this.props.easing,
      delay: this.props.persistTooltip ? 0 : duration,
      useNativeDriver: true,
    })
    const opacityAnim = Animated.timing(this.state.opacity, {
      toValue: 1,
      duration,
      easing: this.props.easing,
      delay: duration,
      useNativeDriver: true,
    })

    const animations = []
    if (
      // @ts-ignore
      toValue !== this.state.tooltipTranslateY._value &&
      !this.props.currentStep?.keepTooltipPosition
    ) {
      animations.push(translateAnim)
    }
    if (!this.props.persistTooltip) {
      this.state.opacity.setValue(0)
      // Set the tooltip content when the opacity is 0
      this.setState({
        isFirstStep: this.props.isFirstStep,
        isLastStep: this.props.isLastStep,
        currentStep: this.props.currentStep,
      })
      animations.push(opacityAnim)
    } else {
      // Even with persistTooltip, we need to update the step content
      this.setState({
        isFirstStep: this.props.isFirstStep,
        isLastStep: this.props.isLastStep,
        currentStep: this.props.currentStep,
      })
      // @ts-ignore
      if (this.state.opacity._value !== 1) {
        animations.push(opacityAnim)
      }
    }
    Animated.parallel(animations).start()

    this.setState({
      tooltip,
      layout,
      size: {
        x: obj.width,
        y: obj.height,
      },
      position: {
        x: Math.floor(Math.max(obj.left, 0)),
        y: Math.floor(Math.max(obj.top, 0)),
      },
    })
  }

  animateMove(obj = {}): Promise<void> {
    return new Promise((resolve) => {
      this.setState({ containerVisible: true }, () =>
        this._animateMove(obj as any).then(resolve),
      )
    })
  }

  reset() {
    this.cleanupLeaderLine()
    this.setState({
      containerVisible: false,
      layout: undefined,
    })
  }

  // Z-INDEX STRATEGY: LeaderLine methods with proper z-index configuration
  private createLeaderLine = () => {
    console.log(`🏹 Modal: [${DEBUG_VERSION}] createLeaderLine() llamado`)
    console.log(`🏹 Modal: [${DEBUG_VERSION}] ⚡ INICIO DE CREACIÓN DE LEADERLINE ⚡`)

    try {
      this.cleanupLeaderLine()

      const config = this.getLeaderLineConfig()
      console.log(`🏹 Modal: [${DEBUG_VERSION}] LeaderLine config:`, config)

      if (!config.enabled) {
        console.log(`🏹 Modal: [${DEBUG_VERSION}] LeaderLine deshabilitado (config.enabled=false)`)
        return
      }

      const hasTooltipRef = !!this.tooltipRef.current
      const hasElementRef = !!this.props.highlightedElementRef?.current

      console.log(`🏹 Modal: [${DEBUG_VERSION}] Refs disponibles:`, {
        tooltipRef: hasTooltipRef,
        highlightedElementRef: hasElementRef,
      })

      if (!hasTooltipRef || !hasElementRef) {
        console.log(`🏹 Modal: [${DEBUG_VERSION}] Refs no disponibles, reintentando en 100ms...`)
        setTimeout(() => {
          this.createLeaderLine()
        }, 100)
        return
      }

      const sourceElement = this.props.highlightedElementRef!.current
      const targetElement = this.tooltipRef.current

      if (sourceElement && targetElement) {
        sourceElement.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          console.log(`🏹 Modal: [${DEBUG_VERSION}] 📍 Elemento origen posición:`, { x, y, width, height, pageX, pageY })
        })
        targetElement.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          console.log(`🏹 Modal: [${DEBUG_VERSION}] 📍 Elemento destino posición:`, { x, y, width, height, pageX, pageY })
        })
      }

      const { enabled, ...leaderLineOptions } = config

      // Z-INDEX CRITICAL: Configurar z-index para LeaderLine SVG
      const leaderLineOptionsWithZIndex = {
        ...leaderLineOptions,
        // Agregar configuración específica para React Native
        zIndex: LEADER_LINE_Z_INDEX, // 10000 - por encima del backdrop (9999) pero debajo del tooltip (10001)
        elevation: LEADER_LINE_Z_INDEX, // Para Android
        // Configuración adicional para forzar rendering
        svgStyle: {
          zIndex: LEADER_LINE_Z_INDEX,
          elevation: LEADER_LINE_Z_INDEX,
          position: 'absolute',
        }
      }

      console.log(`🏹 Modal: [${DEBUG_VERSION}] Creando LeaderLine con opciones Z-INDEX:`, leaderLineOptionsWithZIndex)

      this.leaderLineInstance = createLeaderLine(
        this.props.highlightedElementRef!.current!,
        this.tooltipRef.current!,
        leaderLineOptionsWithZIndex
      )

      console.log(`🏹 Modal: [${DEBUG_VERSION}] LeaderLine creado exitosamente:`, !!this.leaderLineInstance)
      console.log(`🎯 ===== LEADERLINE CREATION STATUS: ${!!this.leaderLineInstance ? 'SUCCESS' : 'FAILED'} [${DEBUG_VERSION}] ===== 🎯`)

      if (this.leaderLineInstance) {
        this.forceLeaderLineVisibility()
        
        // Z-INDEX POST-PROCESAMIENTO: Intentar manipular el SVG después de la creación
        setTimeout(() => {
          this.applyZIndexPostProcessing()
        }, 100)
      }
    } catch (error) {
      console.error(`🏹 Modal: [${DEBUG_VERSION}] Error al crear LeaderLine:`, error)
    }
  }

  private forceLeaderLineVisibility = () => {
    if (!this.leaderLineInstance) return

    console.log(`🏹 Modal: [${DEBUG_VERSION}] 🚀 FORZANDO VISIBILIDAD DE LEADERLINE...`)

    // Strategy 1: Show inmediato
    try {
      this.leaderLineInstance.show?.()
      console.log(`🏹 Modal: [${DEBUG_VERSION}] ✅ Show inmediato ejecutado`)
    } catch (error) {
      console.log(`🏹 Modal: [${DEBUG_VERSION}] ❌ Error en show inmediato:`, error)
    }

    // Strategy 2: Múltiples intentos con delays
    const delays = [50, 100, 200, 500, 1000]
    delays.forEach((delay) => {
      setTimeout(() => {
        try {
          this.leaderLineInstance?.show?.()
          console.log(`🏹 Modal: [${DEBUG_VERSION}] ✅ Show ejecutado después de ${delay}ms`)
        } catch (error) {
          console.log(`🏹 Modal: [${DEBUG_VERSION}] ❌ Error en show después de ${delay}ms:`, error)
        }
      }, delay)
    })

    // Strategy 3: Force position update + show final
    setTimeout(() => {
      try {
        const instance = this.leaderLineInstance
        if (instance.position) {
          instance.position()
          console.log(`🏹 Modal: [${DEBUG_VERSION}] ✅ Position() forzado`)
        }
        if (instance.show) {
          instance.show()
          console.log(`🏹 Modal: [${DEBUG_VERSION}] ✅ Show final después de position()`)
        }
      } catch (error) {
        console.log(`🏹 Modal: [${DEBUG_VERSION}] ❌ Error forzando position:`, error)
      }
    }, 600)
  }

  private applyZIndexPostProcessing = () => {
    console.log(`🏹 Modal: [${DEBUG_VERSION}] 🎨 Aplicando post-procesamiento Z-INDEX...`)
    
    try {
      // Intentar acceder al SVG del LeaderLine y aplicar z-index
      if (this.leaderLineInstance && typeof this.leaderLineInstance === 'object') {
        const instance = this.leaderLineInstance
        
        // Buscar el componente SVG en las propiedades del LeaderLine
        const svgElement = instance.component || instance.svg || instance._svg
        
        if (svgElement) {
          console.log(`🏹 Modal: [${DEBUG_VERSION}] 🎨 SVG encontrado, aplicando z-index...`)
          
          // Aplicar estilos z-index al SVG
          if (svgElement.style) {
            svgElement.style.zIndex = LEADER_LINE_Z_INDEX.toString()
            svgElement.style.elevation = LEADER_LINE_Z_INDEX.toString()
            svgElement.style.position = 'absolute'
            console.log(`🏹 Modal: [${DEBUG_VERSION}] ✅ Z-index aplicado al SVG: ${LEADER_LINE_Z_INDEX}`)
          }
          
          // También intentar con propiedades React Native
          if (svgElement.props) {
            svgElement.props = {
              ...svgElement.props,
              style: {
                ...svgElement.props.style,
                zIndex: LEADER_LINE_Z_INDEX,
                elevation: LEADER_LINE_Z_INDEX,
              }
            }
            console.log(`🏹 Modal: [${DEBUG_VERSION}] ✅ Z-index aplicado a props del SVG`)
          }
        } else {
          console.log(`🏹 Modal: [${DEBUG_VERSION}] ⚠️ SVG no encontrado en LeaderLine instance`)
        }
      }
    } catch (error) {
      console.log(`🏹 Modal: [${DEBUG_VERSION}] ❌ Error en post-procesamiento Z-INDEX:`, error)
    }
  }

  private cleanupLeaderLine = () => {
    console.log(`🏹 Modal: [${DEBUG_VERSION}] cleanupLeaderLine() llamado`)
    if (this.leaderLineInstance) {
      try {
        console.log(`🏹 Modal: [${DEBUG_VERSION}] Limpiando LeaderLine existente...`)
        this.leaderLineInstance.remove()
        console.log(`🏹 Modal: [${DEBUG_VERSION}] LeaderLine removido exitosamente`)
      } catch (error) {
        console.error(`🏹 Modal: [${DEBUG_VERSION}] Error al limpiar LeaderLine:`, error)
      }
      this.leaderLineInstance = null
    }
  }

  private getLeaderLineConfig = (): LeaderLineConfig & { enabled: boolean } => {
    const defaults = {
      enabled: true,
      color: '#FF6B6B', // Rojo brillante para mejor visibilidad
      size: 4,          // Grosor aumentado
      startPlug: 'disc' as PlugType,
      endPlug: 'arrow1' as PlugType,
    }

    const stepConfig = this.props.currentStep?.leaderLineConfig
    const providerConfig = this.props.leaderLineConfig

    const finalConfig = {
      ...defaults,
      ...providerConfig,
      ...stepConfig,
    }

    console.log(`🏹 Modal: [${DEBUG_VERSION}] 🎨 Configuración final de LeaderLine:`, finalConfig)
    return finalConfig
  }

  handleNext = () => {
    this.props.next()
  }

  handlePrev = () => {
    this.props.prev()
  }

  handleStop = () => {
    this.reset()
    this.props.stop()
  }

  renderMask = () => (
    <SvgMask
      style={styles.overlayContainer}
      size={this.state.size!}
      position={this.state.position!}
      easing={this.props.easing}
      animationDuration={this.props.animationDuration}
      backdropColor={this.props.backdropColor}
      currentStep={this.props.currentStep}
      maskOffset={this.props.maskOffset}
      borderRadius={this.props.borderRadius}
      dismissOnPress={this.props.dismissOnPress}
      stop={this.props.stop}
    />
  )

  renderTooltip() {
    const { tooltipComponent: TooltipComponent, visible } = this.props

    if (!visible) {
      return null
    }

    const { opacity, tooltip } = this.state

    // Only apply horizontal styles when tooltipLeftOffset is defined
    const hasCustomLeftOffset =
      this.props.currentStep?.tooltipLeftOffset !== undefined
    const horizontalStyles = hasCustomLeftOffset
      ? {
          left: (tooltip as any).left,
          right: (tooltip as any).right,
          maxWidth: (tooltip as any).maxWidth,
        }
      : {}

    return (
      <Animated.View
        ref={this.tooltipRef}
        pointerEvents='box-none'
        key='tooltip'
        style={[
          styles.tooltip,
          this.props.tooltipStyle,
          horizontalStyles, // Apply only when tooltipLeftOffset is defined
          {
            zIndex: TOOLTIP_Z_INDEX, // CRITICAL FIX: Superior al backdrop (9999) y LeaderLine (10000)
            elevation: TOOLTIP_Z_INDEX, // Para Android
            opacity,
            transform: [{ translateY: this.state.tooltipTranslateY }],
          },
        ]}
      >
        <TooltipComponent
          isFirstStep={this.state.isFirstStep}
          isLastStep={this.state.isLastStep}
          currentStep={this.state.currentStep!}
          handleNext={this.handleNext}
          handlePrev={this.handlePrev}
          handleStop={this.handleStop}
          labels={this.props.labels}
        />
      </Animated.View>
    )
  }

  renderNonInteractionPlaceholder() {
    return this.props.preventOutsideInteraction ? (
      <View
        style={[StyleSheet.absoluteFill, styles.nonInteractionPlaceholder]}
      />
    ) : null
  }

  render() {
    const containerVisible = this.state.containerVisible || this.props.visible
    const contentVisible = this.state.layout && containerVisible
    if (!containerVisible) {
      return null
    }
    return (
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
        pointerEvents='box-none'
      >
        <View
          style={styles.container}
          onLayout={this.handleLayoutChange}
          pointerEvents='box-none'
        >
          {contentVisible && (
            <>
              {this.renderMask()}
              {this.renderNonInteractionPlaceholder()}
              {this.renderTooltip()}
            </>
          )}
        </View>
      </View>
    )
  }
}
