import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { IStep, Labels, LeaderLineConfig } from '../types'
import { Button } from './Button'
import styles from './style'

export interface TooltipProps {
  isFirstStep?: boolean
  isLastStep?: boolean
  currentStep: IStep
  labels?: Labels
  handleNext?: () => void
  handlePrev?: () => void
  handleStop?: () => void
  leaderLineConfig?: LeaderLineConfig
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
  console.log(
    '🏹 Tooltip: componente renderizado para step:',
    currentStep?.name || 'no-name',
  )

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

  console.log('🏹 Tooltip: elemento creado, retornando')
  return tooltipElement
}
