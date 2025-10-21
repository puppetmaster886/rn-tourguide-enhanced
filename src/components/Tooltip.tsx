import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { IStep, Labels, LeaderLineConfig } from '../types'
import { Button } from './Button'
import styles from './style'

export interface TooltipProps<TCustomData = any> {
  isFirstStep?: boolean
  isLastStep?: boolean
  currentStep: IStep<TCustomData>
  labels?: Labels
  handleNext?: () => void
  handlePrev?: () => void
  handleStop?: () => void
  leaderLineConfig?: LeaderLineConfig
  /**
   * Optional ref for custom tooltips to specify the exact connection point for LeaderLine.
   * If not provided, the LeaderLine will connect to the tooltip container's edge.
   * Use this when your custom tooltip has padding and you want the line to connect
   * to the inner content instead of the outer container.
   *
   * @example
   * ```tsx
   * function CustomTooltip({ connectionRef, ...props }: TooltipProps) {
   *   return (
   *     <View style={{ padding: 20 }}>
   *       <View ref={connectionRef}> {/* LeaderLine connects here *\/}
   *         <Text>{props.currentStep.text}</Text>
   *       </View>
   *     </View>
   *   )
   * }
   * ```
   */
  connectionRef?: React.RefObject<View>
  tooltipCustomData?: TCustomData
}

export const Tooltip = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
}: TooltipProps) => {
  const tooltipElement = (
    <View
      style={{
        borderRadius: 16,
        paddingTop: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 16,
        width: '80%',
        backgroundColor: '#ffffffef',
      }}
    >
      <View style={styles.tooltipContainer}>
        <Text testID='stepDescription' style={styles.tooltipText}>
          {currentStep && currentStep.text}
        </Text>
      </View>
      <View style={[styles.bottomBar]}>
        {!isLastStep ? (
          <TouchableOpacity onPress={handleStop}>
            <Button>{labels?.skip || 'Skip'}</Button>
          </TouchableOpacity>
        ) : null}
        {!isFirstStep ? (
          <TouchableOpacity onPress={handlePrev}>
            <Button>{labels?.previous || 'Previous'}</Button>
          </TouchableOpacity>
        ) : null}
        {!isLastStep ? (
          <TouchableOpacity onPress={handleNext}>
            <Button>{labels?.next || 'Next'}</Button>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleStop}>
            <Button>{labels?.finish || 'Finish'}</Button>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  return tooltipElement
}
