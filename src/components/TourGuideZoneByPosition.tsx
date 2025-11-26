import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import {
  BorderRadiusObject,
  ScrollPosition,
  Shape,
  TooltipPosition,
} from '../types'
import { TourGuideZone } from './TourGuideZone'

export interface TourGuideZoneByPositionProps<TCustomData = any> {
  zone: number
  tourKey?: string
  isTourGuide?: boolean
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  width?: number | string
  height?: number | string
  shape?: Shape
  borderRadiusObject?: BorderRadiusObject
  containerStyle?: StyleProp<ViewStyle>
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  tooltipPosition?: TooltipPosition
  scrollPosition?: ScrollPosition
  text?: string
  tooltipCustomData?: TCustomData
}

export const TourGuideZoneByPosition = <TCustomData = any,>({
  isTourGuide,
  zone,
  tourKey = '_default',
  width,
  height,
  top,
  left,
  right,
  bottom,
  shape,
  containerStyle,
  keepTooltipPosition,
  tooltipBottomOffset,
  tooltipPosition,
  scrollPosition,
  borderRadiusObject,
  text,
  tooltipCustomData,
}: TourGuideZoneByPositionProps<TCustomData>) => {
  if (!isTourGuide) {
    return null
  }

  return (
    <View
      pointerEvents='none'
      style={[StyleSheet.absoluteFillObject, containerStyle]}
    >
      <TourGuideZone
        isTourGuide
        {...{
          tourKey,
          zone,
          shape,
          keepTooltipPosition,
          tooltipBottomOffset,
          tooltipPosition,
          scrollPosition,
          borderRadiusObject,
          text,
          tooltipCustomData,
        }}
        style={{
          position: 'absolute',
          height: height as any,
          width: width as any,
          top: top as any,
          right: right as any,
          bottom: bottom as any,
          left: left as any,
        }}
      />
    </View>
  )
}
