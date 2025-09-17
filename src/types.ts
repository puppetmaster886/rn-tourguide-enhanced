export type Shape =
  | 'circle'
  | 'rectangle'
  | 'circle_and_keep'
  | 'rectangle_and_keep'

// Import official types from react-native-leader-line instead of defining our own
import type { LeaderLineOptions } from 'react-native-leader-line'

// Use a subset of the official LeaderLineOptions for our config
export type LeaderLineConfig = Partial<LeaderLineOptions> & {
  enabled?: boolean // Our custom addition for enabling/disabling
}

export interface IStep {
  name: string
  order: number
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
  borderRadiusObject?: BorderRadiusObject
  leaderLineConfig?: LeaderLineConfig
}
export interface StepObject {
  [key: string]: IStep
}
export type Steps = StepObject | IStep[]

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
