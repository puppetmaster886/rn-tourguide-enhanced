import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  BorderRadiusObject,
  LeaderLineConfig,
  MaskOffset,
  Shape,
  TooltipPosition,
} from '../types'
import { Step } from './Step'
import { Wrapper } from './Wrapper'

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
}: TourGuideZoneProps) => {
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
