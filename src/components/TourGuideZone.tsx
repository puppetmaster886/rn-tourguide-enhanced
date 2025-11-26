import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  BorderRadiusObject,
  LeaderLineConfig,
  MaskOffset,
  Shape,
  ScrollPosition,
  TooltipPosition,
} from '../types'
import { Step } from './Step'
import { Wrapper } from './Wrapper'

export interface TourGuideZoneProps<TCustomData = any> {
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
  scrollPosition?: ScrollPosition
  borderRadiusObject?: BorderRadiusObject
  leaderLineConfig?: LeaderLineConfig
  tooltipCustomData?: TCustomData
}

export const TourGuideZone = <TCustomData = any,>({
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
  scrollPosition,
  borderRadiusObject,
  leaderLineConfig,
  tooltipCustomData,
}: TourGuideZoneProps<TCustomData>) => {
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
        scrollPosition,
        borderRadiusObject,
        leaderLineConfig,
        tooltipCustomData,
      }}
    >
      <Wrapper {...{ style }}>{children}</Wrapper>
    </Step>
  )
}
