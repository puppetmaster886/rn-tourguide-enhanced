import * as React from 'react'
import {
  BorderRadiusObject,
  LeaderLineConfig,
  MaskOffset,
  Shape,
} from '../types'
import { ConnectedStep } from './ConnectedStep'
import { TourGuideContext } from './TourGuideContext'

interface Props {
  name: string
  order: number
  text: string
  tourKey: string
  shape?: Shape
  active?: boolean
  maskOffset?: MaskOffset
  borderRadius?: number
  children: React.ReactNode
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  tooltipLeftOffset?: number
  borderRadiusObject?: BorderRadiusObject
  leaderLineConfig?: LeaderLineConfig
}

export const Step = (props: Props) => {
  const context = React.useContext(TourGuideContext)
  return <ConnectedStep {...{ ...props, context }} />
}
