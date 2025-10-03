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
import styles, { MARGIN, TOOLTIP_Z_INDEX } from './style'
import { SvgMask } from './SvgMask'
import { Tooltip, TooltipProps } from './Tooltip'

declare var __TEST__: boolean

// Import official types and components from react-native-leader-line
import type {
  PlugType,
  SocketPosition,
  PathType,
} from 'react-native-leader-line'
import { LeaderLine as OriginalLeaderLine } from 'react-native-leader-line'

// Wrapper para LeaderLine
const LeaderLine: React.FC<any> = (props) => {
  return React.createElement(OriginalLeaderLine, props)
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
  tooltipLayoutReady: boolean
  highlightedAreaLayoutReady: boolean
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
  private tooltipContentRef = React.createRef<View>() // Ref para el contenido interno sin padding
  private customTooltipConnectionRef = React.createRef<View>() // Ref opcional para tooltips custom
  private containerRef = React.createRef<View>()
  private highlightedAreaRef = React.createRef<View>()

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
    tooltipLayoutReady: false,
    highlightedAreaLayoutReady: false,
  }

  constructor(props: ModalProps) {
    super(props)
  }

  componentDidUpdate(prevProps: ModalProps) {
    if (prevProps.visible === true && this.props.visible === false) {
      this.reset()
    }

    // Reset tooltip layout ready flag when step changes
    if (prevProps.currentStep !== this.props.currentStep) {
      this.setState({
        tooltipLayoutReady: false,
        highlightedAreaLayoutReady: false,
      })
    }

    // With Functional Component API, LeaderLine updates automatically via props
    // No manual recreation needed
  }

  handleLayoutChange = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    this.layout = layout
  }

  handleTooltipLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    if (
      !this.state.tooltipLayoutReady &&
      layout.width > 0 &&
      layout.height > 0
    ) {
      // Same delay strategy for consistency
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.setState({ tooltipLayoutReady: true })
          }, 50)
        })
      })
    }
  }

  handleHighlightedAreaLayout = ({
    nativeEvent: { layout },
  }: LayoutChangeEvent) => {
    if (
      !this.state.highlightedAreaLayoutReady &&
      layout.width > 0 &&
      layout.height > 0
    ) {
      // Add extra delay to ensure refs are fully measurable by LeaderLine
      // Using double RAF + small timeout for better stability
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.setState({ highlightedAreaLayoutReady: true })
          }, 50)
        })
      })
    }
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

  // Helper function to check if two rectangles overlap
  checkOverlap(
    rect1: { left: number; top: number; right: number; bottom: number },
    rect2: { left: number; top: number; right: number; bottom: number },
  ): boolean {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    )
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

    // Estimated tooltip dimensions (width: 80% of screen from Tooltip.tsx, height: estimated)
    const TOOLTIP_HEIGHT = 135
    const tooltipWidth = layout.width! * 0.8
    const tooltipHeight =
      TOOLTIP_HEIGHT + (this.props.currentStep?.tooltipBottomOffset || 0)

    // Calculate centered position
    const centeredLeft = (layout.width! - tooltipWidth) / 2
    const centeredTop = (layout.height! - tooltipHeight) / 2

    const tooltip = {
      top: 0,
      tooltip: 0,
      bottom: 0,
      right: 0,
      maxWidth: 0,
      left: 0,
    }

    // Determine positioning strategy
    const tooltipPosition = this.props.currentStep?.tooltipPosition || 'relative'
    const customLeftOffset = this.props.currentStep?.tooltipLeftOffset

    // Custom left offset takes precedence over all positioning strategies
    if (customLeftOffset !== undefined) {
      tooltip.left = customLeftOffset
      tooltip.maxWidth = layout.width! - tooltip.left - MARGIN
      tooltip.right = 0
      tooltip.top = centeredTop
    } else if (tooltipPosition === 'centered') {
      // Always center the tooltip
      tooltip.left = centeredLeft
      tooltip.maxWidth = tooltipWidth
      tooltip.right = 0
      tooltip.top = centeredTop
    } else if (tooltipPosition === 'relative') {
      // Always use relative positioning (original rn-tourguide behavior)
      const center = {
        x: obj.left! + obj.width! / 2,
        y: obj.top! + obj.height! / 2,
      }

      const relativeToLeft = center.x
      const relativeToTop = center.y
      const relativeToBottom = Math.abs(center.y - layout.height!)
      const relativeToRight = Math.abs(center.x - layout.width!)

      const verticalPosition =
        relativeToBottom > relativeToTop ? 'bottom' : 'top'
      const horizontalPosition =
        relativeToLeft > relativeToRight ? 'left' : 'right'

      if (verticalPosition === 'bottom') {
        tooltip.top = obj.top + obj.height + MARGIN
      } else {
        tooltip.bottom = layout.height! - (obj.top - MARGIN)
      }

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
    } else {
      // 'auto': center if no overlap, relative if overlap
      const centeredTooltipRect = {
        left: centeredLeft,
        top: centeredTop,
        right: centeredLeft + tooltipWidth,
        bottom: centeredTop + tooltipHeight,
      }

      const highlightedRect = {
        left: obj.left,
        top: obj.top,
        right: obj.left + obj.width,
        bottom: obj.top + obj.height,
      }

      const hasOverlap = this.checkOverlap(centeredTooltipRect, highlightedRect)

      if (!hasOverlap) {
        // No overlap: use centered position
        tooltip.left = centeredLeft
        tooltip.maxWidth = tooltipWidth
        tooltip.right = 0
        tooltip.top = centeredTop
      } else {
        // Overlap detected: use position relative to highlighted element
        const center = {
          x: obj.left! + obj.width! / 2,
          y: obj.top! + obj.height! / 2,
        }

        const relativeToLeft = center.x
        const relativeToTop = center.y
        const relativeToBottom = Math.abs(center.y - layout.height!)
        const relativeToRight = Math.abs(center.x - layout.width!)

        const verticalPosition =
          relativeToBottom > relativeToTop ? 'bottom' : 'top'
        const horizontalPosition =
          relativeToLeft > relativeToRight ? 'left' : 'right'

        if (verticalPosition === 'bottom') {
          tooltip.top = obj.top + obj.height + MARGIN
        } else {
          tooltip.bottom = layout.height! - (obj.top - MARGIN)
        }

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
    }

    const duration = this.props.animationDuration! + 200
    // Calculate toValue based on positioning strategy
    let toValue: number

    // When using centered mode or custom offset, use tooltip.top directly
    if (customLeftOffset !== undefined || tooltipPosition === 'centered') {
      toValue = tooltip.top
    } else if (tooltipPosition === 'relative' || tooltipPosition === 'auto') {
      // For relative or auto modes, calculate based on element position
      const center = {
        x: obj.left! + obj.width! / 2,
        y: obj.top! + obj.height! / 2,
      }
      const relativeToTop = center.y
      const relativeToBottom = Math.abs(center.y - layout.height!)
      const verticalPosition =
        relativeToBottom > relativeToTop ? 'bottom' : 'top'

      toValue =
        verticalPosition === 'bottom'
          ? tooltip.top
          : obj.top -
            MARGIN -
            135 -
            (this.props.currentStep?.tooltipBottomOffset || 0)
    } else {
      // Fallback to tooltip.top
      toValue = tooltip.top
    }
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
    this.setState({
      containerVisible: false,
      layout: undefined,
    })
  }

  private getLeaderLineConfig = (): LeaderLineConfig & { enabled: boolean } => {
    const defaults = {
      enabled: true,
      startSocket: 'auto' as SocketPosition,
      endSocket: 'auto' as SocketPosition,
      color: 'white',
      size: 4,
      endPlug: 'arrow1' as PlugType,
      endPlugColor: 'white',
      path: 'straight' as PathType,
    }

    const stepConfig = this.props.currentStep?.leaderLineConfig
    const providerConfig = this.props.leaderLineConfig

    const finalConfig = {
      ...defaults,
      ...providerConfig,
      ...stepConfig,
    }

    return finalConfig
  }

  renderHighlightedArea() {
    const { visible } = this.props
    const { position, size } = this.state

    if (!visible || !position || !size) {
      return null
    }

    // CRITICAL FIX: Force re-mount on step change to ensure onLayout is always called
    const highlightedKey = `highlighted-${this.props.currentStep?.name || 'none'}`

    // View invisible posicionado en el área destacada para servir como referencia de LeaderLine
    return (
      <View
        ref={this.highlightedAreaRef}
        collapsable={false}
        key={highlightedKey}
        style={{
          position: 'absolute',
          left: (position as ValueXY).x,
          top: (position as ValueXY).y,
          width: (size as ValueXY).x,
          height: (size as ValueXY).y,
          backgroundColor: 'transparent',
        }}
        pointerEvents='none'
        onLayout={this.handleHighlightedAreaLayout}
      />
    )
  }

  renderLeaderLine() {
    const { visible } = this.props

    if (!visible) {
      return null
    }

    const config = this.getLeaderLineConfig()

    if (!config.enabled) {
      return null
    }

    // Wait for both tooltip and highlighted area layouts to be ready
    if (!this.state.tooltipLayoutReady) {
      return null
    }

    if (!this.state.highlightedAreaLayoutReady) {
      return null
    }

    // Detect if using custom tooltip
    const isCustomTooltip = this.props.tooltipComponent !== Tooltip
    let tooltipConnectionRef: React.RefObject<View>

    if (isCustomTooltip) {
      // Custom tooltip MUST provide connectionRef
      if (!this.customTooltipConnectionRef.current) {
        return null
      }
      tooltipConnectionRef = this.customTooltipConnectionRef
    } else {
      // Default tooltip uses internal tooltipContentRef
      tooltipConnectionRef = this.tooltipContentRef
    }

    const hasTooltipRef = !!tooltipConnectionRef.current
    const hasHighlightedAreaRef = !!this.highlightedAreaRef.current

    if (!hasTooltipRef || !hasHighlightedAreaRef) {
      return null
    }

    const { enabled, ...leaderLineOptions } = config

    return (
      <LeaderLine
        start={{ element: tooltipConnectionRef }}
        end={{ element: this.highlightedAreaRef }}
        containerRef={this.containerRef}
        {...leaderLineOptions}
        strokeWidth={leaderLineOptions.size || 4}
      />
    )
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

    // CRITICAL FIX: Force re-mount on step change to ensure onLayout is always called
    const tooltipKey = `tooltip-${this.props.currentStep?.name || 'none'}`

    return (
      <Animated.View
        ref={this.tooltipRef}
        pointerEvents='box-none'
        key={tooltipKey}
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
        <View
          ref={this.tooltipContentRef}
          collapsable={false}
          style={{ width: '100%' }}
          onLayout={this.handleTooltipLayout}
        >
          <TooltipComponent
            isFirstStep={this.state.isFirstStep}
            isLastStep={this.state.isLastStep}
            currentStep={this.state.currentStep!}
            handleNext={this.handleNext}
            handlePrev={this.handlePrev}
            handleStop={this.handleStop}
            labels={this.props.labels}
            connectionRef={this.customTooltipConnectionRef}
          />
        </View>
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
        ref={this.containerRef}
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
              {this.renderHighlightedArea()}
              {this.renderNonInteractionPlaceholder()}
              {this.renderTooltip()}
              {this.renderLeaderLine()}
            </>
          )}
        </View>
      </View>
    )
  }
}
