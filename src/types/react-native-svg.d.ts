// Type declarations for react-native-svg to allow compilation without dependency
// Compatible with versions 12.x - 15.x
declare module 'react-native-svg' {
  import { Component } from 'react'
  import { ViewProps, ViewStyle } from 'react-native'

  export interface PathProps extends ViewProps {
    d?: string
    fill?: string
    stroke?: string
    strokeWidth?: number | string
    fillRule?: 'evenodd' | 'nonzero'
    opacity?: number
    style?: ViewStyle
    onPress?: () => void
    // Additional props for compatibility with newer versions
    [key: string]: any
  }

  export interface SvgProps extends ViewProps {
    width?: number | string
    height?: number | string
    viewBox?: string
    pointerEvents?: 'none' | 'auto' | 'box-none' | 'box-only'
    children?: React.ReactNode
    style?: ViewStyle
    // Additional props for compatibility with newer versions
    [key: string]: any
  }

  export class Path extends Component<PathProps> {
    // Legacy methods (v12.x - v14.x)
    setNativeProps?: (props: any) => void
    _touchableNode?: any

    // Newer methods (v15.x+)
    _setNativeProps?: (props: any) => void
    setAttribute?: (name: string, value: any) => void;

    // Additional compatibility methods
    [key: string]: any
  }

  export default class Svg extends Component<SvgProps> {}
}
