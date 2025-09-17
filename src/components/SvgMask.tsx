import React, { Component } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScaledSize,
  StyleProp,
  ViewStyle,
} from 'react-native'
import Svg, { PathProps } from 'react-native-svg'
import { IStep, MaskOffset, ValueXY } from '../types'
import { IS_NATIVE, svgMaskPathMorph } from '../utilities'
import { AnimatedSvgPath } from './AnimatedPath'
import { BACKDROP_Z_INDEX } from './style' // Import the z-index constant

interface Props {
  size: ValueXY
  position: ValueXY
  style: StyleProp<ViewStyle>
  animationDuration?: number
  backdropColor: string
  dismissOnPress?: boolean
  maskOffset?: MaskOffset
  borderRadius?: number
  currentStep?: IStep
  easing: (value: number) => number
  stop: () => void
}

interface State {
  size: ValueXY
  position: ValueXY
  opacity: Animated.Value
  animation: Animated.Value
  canvasSize: ValueXY
  previousPath: string
  nextSvgPath: string
  composedSvgPath: string
  viewBoxDimentions: string
  isAnimating: boolean
}

const getSvgPath = () =>
  `M0,0H${Dimensions.get('window').width}V${
    Dimensions.get('window').height
  }H0V0ZM${Dimensions.get('window').width / 2},${
    Dimensions.get('window').height / 2
  } h 1 v 1 h -1 Z`
const getViewBoxDimentions = () =>
  `0 0 ${Dimensions.get('window').width} ${Dimensions.get('window').height}`

export class SvgMask extends Component<Props, State> {
  static defaultProps = {
    easing: Easing.linear,
    size: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    maskOffset: 0,
  }

  listenerID: string
  resizeListenerID: string | null
  rafID: number
  mask: React.RefObject<PathProps> = React.createRef()

  windowDimensions: ScaledSize
  dimensionsSubscription: any

  constructor(props: Props) {
    super(props)

    this.windowDimensions = Platform.select({
      android: Dimensions.get('screen'),
      default: Dimensions.get('window'),
    })

    this.state = {
      canvasSize: {
        x: this.windowDimensions.width + 50,
        y: this.windowDimensions.height,
      },
      size: props.size,
      position: props.position,
      opacity: new Animated.Value(0),
      animation: new Animated.Value(0),
      previousPath: getSvgPath(),
      viewBoxDimentions: getViewBoxDimentions(),
      nextSvgPath: getSvgPath(),
      composedSvgPath: getSvgPath(),
      isAnimating: false,
    }

    this.listenerID = this.state.animation.addListener(this.animationListener)
  }

  componentDidMount() {
    IS_NATIVE
      ? (this.dimensionsSubscription = Dimensions.addEventListener(
          'change',
          this.recalculatePath,
        ))
      : window.addEventListener('resize', this.recalculatePath)

    // Delay para permitir que Modal se configure primero
    setTimeout(() => {
      this.animate()
    }, 200)
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.position !== this.props.position ||
      prevProps.size !== this.props.size
    ) {
      this.recalculatePath()
    }
  }

  componentWillUnmount() {
    if (this.listenerID) {
      this.state.animation.removeListener(this.listenerID)
    }
    if (this.rafID) {
      cancelAnimationFrame(this.rafID)
    }
    IS_NATIVE
      ? this.dimensionsSubscription?.remove()
      : window.removeEventListener('resize', this.recalculatePath)
  }

  getPath = () => {
    const { previousPath, animation } = this.state
    const { size, position, currentStep, maskOffset, borderRadius } = this.props

    const result = svgMaskPathMorph({
      animation: animation as any,
      previousPath,
      to: {
        position,
        size,
        shape: currentStep?.shape,
        maskOffset: currentStep?.maskOffset || maskOffset,
        borderRadius: currentStep?.borderRadius || borderRadius,
        borderRadiusObject: currentStep?.borderRadiusObject,
      },
    })

    return result
  }

  animationListener = () => {
    const d = this.getPath()
    this.rafID = requestAnimationFrame(() => {
      // SIEMPRE actualizar el state composedSvgPath para mantener sync
      this.setState({ composedSvgPath: d })

      if (this.mask && this.mask.current) {
        if (IS_NATIVE) {
          // Compatibilidad con múltiples versiones de react-native-svg
          try {
            // @ts-ignore - Método para versiones más antiguas (12.x)
            if (this.mask.current.setNativeProps) {
              this.mask.current.setNativeProps({ d })
            }
            // Método alternativo para versiones más nuevas
            else if (this.mask.current._setNativeProps) {
              // @ts-ignore
              this.mask.current._setNativeProps({ d })
            }
          } catch (error) {
            console.warn(
              'SvgMask: setNativeProps failed, using state update',
              error,
            )
            // Ya se actualiza el state arriba
          }
        } else {
          // Web compatibility
          try {
            // @ts-ignore - Para versiones más antiguas
            if (this.mask.current._touchableNode) {
              this.mask.current._touchableNode.setAttribute('d', d)
            }
            // Método alternativo para versiones más nuevas
            else if (this.mask.current.setAttribute) {
              // @ts-ignore
              this.mask.current.setAttribute('d', d)
            }
          } catch (error) {
            console.warn(
              'SvgMask: Web DOM manipulation failed, using state update',
              error,
            )
            // Ya se actualiza el state arriba
          }
        }
      }
    })
  }

  animate = () => {
    // Prevenir múltiples animaciones simultáneas
    if (this.state.isAnimating) {
      return
    }

    // Marcar que está animando
    this.setState({ isAnimating: true })

    const animations = []
    if (this.props.animationDuration! > 0) {
      animations.push(
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: this.props.animationDuration,
          easing: this.props.easing,
          useNativeDriver: true,
        }),
      )
      animations.push(
        Animated.timing(this.state.animation, {
          toValue: 1,
          duration: this.props.animationDuration,
          easing: this.props.easing,
          useNativeDriver: true,
        }),
      )
    } else {
      // Sin animación, establecer valores inmediatamente
      this.state.opacity.setValue(1)
      this.state.animation.setValue(1)
    }

    if (animations.length > 0) {
      Animated.parallel(animations, { stopTogether: false }).start((result) => {
        // Marcar que la animación terminó
        this.setState({ isAnimating: false })

        if (result.finished) {
          // Actualizar composedSvgPath con el path final correcto
          const finalPath = this.getPath()

          this.setState(
            {
              previousPath: finalPath,
              composedSvgPath: finalPath,
            },
            () => {
              // Forzar re-render final para asegurar visibilidad
              setTimeout(() => {
                this.forceUpdate()
              }, 50)
            },
          )
        }
      })
    } else {
      // Sin animaciones, marcar como completo inmediatamente
      this.setState(
        {
          isAnimating: false,
          previousPath: this.getPath(),
        },
        () => {
          this.forceUpdate()
        },
      )
    }
  }

  handleLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }: LayoutChangeEvent) => {
    this.setState({
      canvasSize: {
        x: width,
        y: height,
      },
    })
  }

  recalculatePath = () => {
    this.setState((state) => ({
      ...state,
      previousPath: getSvgPath(),
      viewBoxDimentions: getViewBoxDimentions(),
    }))
    this.setState((state) => ({ ...state, composedSvgPath: this.getPath() }))
    this.animate()
  }

  render() {
    if (!this.state.canvasSize) {
      return null
    }

    const { dismissOnPress, stop } = this.props

    // Asegurar que el estilo incluya posicionamiento absoluto y z-index consistente
    const containerStyle = [
      {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: BACKDROP_Z_INDEX, // Usar constante definida
        elevation: BACKDROP_Z_INDEX, // Para Android
      },
      this.props.style,
    ]

    try {
      const svgElement = (
        <Pressable
          style={containerStyle}
          onLayout={this.handleLayout}
          pointerEvents={dismissOnPress ? undefined : 'none'}
          onPress={dismissOnPress ? stop : undefined}
        >
          <Svg
            pointerEvents='none'
            width={this.state.canvasSize.x}
            height={this.state.canvasSize.y}
            viewBox={this.state.viewBoxDimentions}
            style={{
              backgroundColor: 'transparent',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <AnimatedSvgPath
              ref={this.mask}
              fill={this.props.backdropColor}
              strokeWidth={0}
              fillRule='evenodd'
              d={this.state.composedSvgPath}
              opacity={
                // @ts-ignore - Compatibilidad con múltiples versiones
                typeof this.state.opacity === 'object' &&
                (this.state.opacity as any)._value !== undefined
                  ? (this.state.opacity as any)._value
                  : this.state.opacity
              }
            />
          </Svg>
        </Pressable>
      )

      return svgElement
    } catch (error: any) {
      console.error('🎭 SvgMask: Error en render():', error)
      // Fallback: retornar un View simple en caso de error
      return null
    }
  }
}
