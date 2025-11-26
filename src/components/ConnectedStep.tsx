import * as React from 'react'
import { View } from 'react-native'
import {
  BorderRadiusObject,
  LeaderLineConfig,
  MaskOffset,
  Shape,
  ScrollPosition,
} from '../types'
import { ITourGuideContext } from './TourGuideContext'

declare var __TEST__: boolean

interface Props<TCustomData = any> {
  name: string
  text: string
  order: number
  tourKey: string
  active?: boolean
  shape?: Shape
  context: ITourGuideContext
  children?: any
  maskOffset?: MaskOffset
  borderRadiusObject?: BorderRadiusObject
  borderRadius?: number
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  scrollPosition?: ScrollPosition
  leaderLineConfig?: LeaderLineConfig
  tooltipCustomData?: TCustomData
}

export class ConnectedStep<TCustomData = any> extends React.Component<
  Props<TCustomData>
> {
  static defaultProps = {
    active: true,
  }
  wrapper: any
  wrapperRef = React.createRef<View>()

  componentDidMount() {
    if (this.props.active) {
      this.register()
      this.registerElementRef()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.active !== prevProps.active) {
      if (this.props.active) {
        this.register()
        this.registerElementRef()
      } else {
        this.unregister()
        this.unregisterElementRef()
      }
    }
  }

  componentWillUnmount() {
    this.unregister()
    this.unregisterElementRef()
  }

  setNativeProps(obj: any) {
    this.wrapper.setNativeProps(obj)
  }

  register() {
    if (this.props.context && this.props.context.registerStep) {
      const stepData = {
        target: this,
        wrapper: this.wrapper,
        ...this.props,
      }
      this.props.context.registerStep(this.props.tourKey, stepData)
    }
  }

  unregister() {
    if (this.props.context && this.props.context.unregisterStep) {
      this.props.context.unregisterStep(this.props.tourKey, this.props.name)
    }
  }

  registerElementRef() {
    if (
      this.props.context &&
      this.props.context.registerHighlightedElementRef &&
      this.wrapperRef
    ) {
      this.props.context.registerHighlightedElementRef(
        this.props.tourKey,
        this.wrapperRef,
      )
    }
  }

  unregisterElementRef() {
    if (
      this.props.context &&
      this.props.context.unregisterHighlightedElementRef
    ) {
      this.props.context.unregisterHighlightedElementRef(this.props.tourKey)
    }
  }

  measure() {
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

    return new Promise((resolve, reject) => {
      const measure = () => {
        // Wait until the wrapper element appears
        if (this.wrapper && this.wrapper.measure) {
          this.wrapper.measure(
            (
              _ox: number,
              _oy: number,
              width: number,
              height: number,
              x: number,
              y: number,
            ) => {
              const result = {
                x,
                y,
                width,
                height,
              }

              resolve(result)
            },
            reject,
          )
        } else {
          requestAnimationFrame(measure)
        }
      }

      requestAnimationFrame(measure)
    })
  }

  render() {
    const copilot = {
      ref: (wrapper: any) => {
        this.wrapper = wrapper
        // Also assign to the React ref for LeaderLine
        if (this.wrapperRef.current !== wrapper) {
          // @ts-ignore - assigning the wrapper element to the ref
          this.wrapperRef.current = wrapper
        }
      },
      onLayout: () => {}, // Android hack
    }

    return React.cloneElement(this.props.children, { copilot })
  }
}
