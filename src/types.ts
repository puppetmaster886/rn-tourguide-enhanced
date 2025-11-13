export type Shape =
  | 'circle'
  | 'rectangle'
  | 'ellipse'
  | 'circle_and_keep'
  | 'rectangle_and_keep'

export type TooltipPosition =
  | 'centered' // Always center the tooltip
  | 'relative' // Always position relative to highlighted element (original rn-tourguide behavior)
  | 'auto' // Auto-detect: center if no overlap, relative if overlap (default)

// Import official types from react-native-leader-line instead of defining our own
import type { LeaderLineProps } from 'react-native-leader-line'

// Use a subset of the official LeaderLineProps for our config
export type LeaderLineConfig = Partial<
  Omit<
    LeaderLineProps,
    'start' | 'end' | 'containerRef' | 'options' | 'children' | 'testID'
  >
> & {
  updateThreshold?: number // Our custom addition for controlling update frequency
  enabled?: boolean // Our custom addition for enabling/disabling
  style?: import('react-native').ViewStyle
  optimizeUpdates?: boolean
  smoothAnimations?: boolean
}

export interface IStep<TCustomData = any> {
  name: string
  order: number
  tourKey?: string
  visible?: boolean
  target: any
  text: string
  wrapper: any
  shape?: Shape
  maskOffset?: MaskOffset
  borderRadius?: number
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  tooltipLeftOffset?: number
  tooltipPosition?: TooltipPosition
  borderRadiusObject?: BorderRadiusObject
  leaderLineConfig?: LeaderLineConfig
  tooltipCustomData?: TCustomData
}
export interface StepObject<TCustomData = any> {
  [key: string]: IStep<TCustomData>
}
export type Steps<TCustomData = any> =
  | StepObject<TCustomData>
  | IStep<TCustomData>[]

export interface ValueXY {
  x: number
  y: number
}

export interface BorderRadiusObject {
  topLeft?: number
  topRight?: number
  bottomRight?: number
  bottomLeft?: number
}

export type SvgPath = string

// with flubber
export interface AnimJSValue {
  _value: number
}
export interface SVGMaskPathMorphParam {
  animation: AnimJSValue
  previousPath: SvgPath
  to: {
    position: ValueXY
    size: ValueXY
    shape?: Shape
    maskOffset?: MaskOffset
    borderRadius?: number
    borderRadiusObject?: BorderRadiusObject
  }
}
export type SVGMaskPathMorph = (
  param: SVGMaskPathMorphParam,
) => string | string[]

export interface Labels {
  skip?: string
  previous?: string
  next?: string
  finish?: string
}

export interface MaskOffsetObject {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export type MaskOffset = number | MaskOffsetObject
