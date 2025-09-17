import mitt, { Emitter } from 'mitt'
import * as React from 'react'
import {
  Dimensions,
  findNodeHandle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import { useIsMounted } from '../hooks/useIsMounted'
import { IStep, Labels, LeaderLineConfig, StepObject, Steps } from '../types'
import * as utils from '../utilities'
import { Modal } from './Modal'
import { OFFSET_WIDTH } from './style'
import { TooltipProps } from './Tooltip'
import { Ctx, TourGuideContext } from './TourGuideContext'

const { useMemo, useEffect, useState, useRef } = React
/*
This is the maximum wait time for the steps to be registered before starting the tutorial
At 60fps means 2 seconds
*/
const MAX_START_TRIES = 120

export interface TourGuideProviderProps {
  tooltipComponent?: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  labels?: Labels
  androidStatusBarVisible?: boolean
  startAtMount?: string | boolean
  backdropColor?: string
  verticalOffset?: number
  wrapperStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  borderRadius?: number
  animationDuration?: number
  children: React.ReactNode
  dismissOnPress?: boolean
  preventOutsideInteraction?: boolean
  persistTooltip?: boolean
  leaderLineConfig?: LeaderLineConfig
}

export const TourGuideProvider = ({
  children,
  wrapperStyle,
  labels,
  tooltipComponent,
  tooltipStyle,
  androidStatusBarVisible,
  backdropColor,
  animationDuration,
  maskOffset,
  borderRadius,
  verticalOffset,
  startAtMount = false,
  dismissOnPress = false,
  preventOutsideInteraction = false,
  persistTooltip = false,
  leaderLineConfig,
}: TourGuideProviderProps) => {
  const [scrollRef, setScrollRef] = useState<React.RefObject<any>>()
  const [tourKey, setTourKey] = useState<string | '_default'>('_default')
  const [visible, updateVisible] = useState<Ctx<boolean | undefined>>({
    _default: false,
  })
  const setVisible = (key: string, value: boolean) =>
    updateVisible((visible) => {
      const newVisible = { ...visible }
      newVisible[key] = value
      return newVisible
    })
  const [currentStep, updateCurrentStep] = useState<Ctx<IStep | undefined>>({
    _default: undefined,
  })
  const [steps, setSteps] = useState<Ctx<Steps>>({ _default: [] })

  const [canStart, setCanStart] = useState<Ctx<boolean>>({ _default: false })

  const [windowIsResized, setWindowResized] = useState(false)

  // Add state to track the highlighted element ref for LeaderLine
  const [highlightedElementRef, setHighlightedElementRef] = useState<
    Ctx<React.RefObject<View> | undefined>
  >({ _default: undefined })

  // Function to register highlighted element ref
  const registerHighlightedElementRef = (
    key: string,
    ref: React.RefObject<View>,
  ) => {
    console.log('🏹 TourGuideProvider: registerHighlightedElementRef llamado')
    console.log('🏹 TourGuideProvider: key:', key)
    console.log('🏹 TourGuideProvider: ref:', !!ref)
    console.log('🏹 TourGuideProvider: ref.current:', !!ref?.current)

    setHighlightedElementRef((prev) => {
      const newRefs = {
        ...prev,
        [key]: ref,
      }
      console.log(
        '🏹 TourGuideProvider: highlightedElementRef actualizado:',
        Object.keys(newRefs),
      )
      return newRefs
    })
  }

  // Function to unregister highlighted element ref
  const unregisterHighlightedElementRef = (key: string) => {
    console.log(
      '🏹 TourGuideProvider: unregisterHighlightedElementRef llamado para key:',
      key,
    )

    setHighlightedElementRef((prev) => {
      const newRefs = { ...prev }
      delete newRefs[key]
      console.log(
        '🏹 TourGuideProvider: highlightedElementRef después de unregister:',
        Object.keys(newRefs),
      )
      return newRefs
    })
  }

  const startTries = useRef<number>(0)
  const { current: mounted } = useIsMounted()

  const { current: eventEmitter } = useRef<Ctx<Emitter>>({
    _default: new mitt(),
  })

  const modal = useRef<any>()

  useEffect(() => {
    if (mounted && visible[tourKey] === false) {
      eventEmitter[tourKey]?.emit('stop')
    }
  }, [visible])

  useEffect(() => {
    if (visible || (windowIsResized && currentStep) || currentStep) {
      moveToCurrentStep(tourKey)
      setWindowResized(false)
    }
  }, [visible, currentStep, windowIsResized])

  const setWindowIsResized = () => {
    setWindowResized(true)
  }

  useEffect(() => {
    let subscription: any
    if (utils.IS_NATIVE) {
      subscription = Dimensions.addEventListener('change', setWindowIsResized)
    } else {
      window.addEventListener('resize', setWindowIsResized)
    }

    return () => {
      utils.IS_NATIVE
        ? subscription?.remove()
        : window.removeEventListener('resize', setWindowIsResized)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      if (steps[tourKey]) {
        if (
          (Array.isArray(steps[tourKey]) && steps[tourKey].length > 0) ||
          Object.entries(steps[tourKey]).length > 0
        ) {
          setCanStart((obj) => {
            const newObj = { ...obj }
            newObj[tourKey] = true
            return newObj
          })
          if (typeof startAtMount === 'string') {
            start(startAtMount)
          } else if (startAtMount) {
            start('_default')
          }
        } else {
          setCanStart((obj) => {
            const newObj = { ...obj }
            newObj[tourKey] = false
            return newObj
          })
        }
      }
    }
  }, [mounted, steps])

  const moveToCurrentStep = async (key: string) => {
    console.log(
      '🎯 TourGuideProvider: moveToCurrentStep() llamado con key:',
      key,
    )
    const size = await currentStep[key]?.target.measure()
    console.log('🎯 TourGuideProvider: size medido:', size)

    if (
      size === undefined ||
      isNaN(size.width) ||
      isNaN(size.height) ||
      isNaN(size.x) ||
      isNaN(size.y)
    ) {
      console.log('🎯 TourGuideProvider: size inválido, retornando')
      return
    }

    const moveParams = {
      width: size.width + OFFSET_WIDTH,
      height: size.height + OFFSET_WIDTH,
      left: Math.round(size.x) - OFFSET_WIDTH / 2,
      top: Math.round(size.y) - OFFSET_WIDTH / 2 + (verticalOffset || 0),
    }

    console.log('🎯 TourGuideProvider: llamando animateMove con:', moveParams)

    // COORDINACIÓN MEJORADA: Ejecutar animaciones secuencialmente
    // Esto evita conflictos entre SvgMask y Modal animaciones
    try {
      await modal.current?.animateMove(moveParams)
      console.log('🎯 TourGuideProvider: animateMove completado')

      // Pequeño delay para asegurar que las animaciones se estabilicen
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Forzar un re-render final para asegurar visibilidad
      if (modal.current) {
        setTimeout(() => {
          console.log(
            '🎯 TourGuideProvider: Forzando re-render final del Modal',
          )
          modal.current.forceUpdate()
        }, 50)
      }
    } catch (error) {
      console.error('🎯 TourGuideProvider: Error en animateMove:', error)
    }
  }

  const setCurrentStep = async (key: string, step?: IStep) =>
    new Promise<void>(async (resolve) => {
      console.log('📝 TourGuideProvider: setCurrentStep() llamado')
      console.log('📝 TourGuideProvider: key:', key)
      console.log('📝 TourGuideProvider: step:', step?.name || 'no-step')
      console.log('📝 TourGuideProvider: scrollRef:', !!scrollRef)

      if (scrollRef && step) {
        console.log('📝 TourGuideProvider: midiendo layout para scroll')
        await step.wrapper.measureLayout(
          findNodeHandle(scrollRef.current),
          (_x: number, y: number, _w: number, h: number) => {
            const yOffsett = y > 0 ? y - h / 2 : 0
            console.log('📝 TourGuideProvider: haciendo scroll a:', yOffsett)
            scrollRef.current.scrollTo({ y: yOffsett, animated: false })
          },
        )
        setTimeout(() => {
          console.log(
            '📝 TourGuideProvider: actualizando currentStep después del scroll',
          )
          updateCurrentStep((currentStep) => {
            const newStep = { ...currentStep }
            newStep[key] = step
            eventEmitter[key]?.emit('stepChange', step)
            return newStep
          })
          resolve()
        }, 100)
      } else {
        console.log('📝 TourGuideProvider: actualizando currentStep sin scroll')
        updateCurrentStep((currentStep) => {
          const newStep = { ...currentStep }
          newStep[key] = step
          eventEmitter[key]?.emit('stepChange', step)
          return newStep
        })
        resolve()
      }
    })

  const getNextStep = (
    key: string,
    step: IStep | undefined = currentStep[key],
  ) => utils.getNextStep(steps[key]!, step)

  const getPrevStep = (
    key: string,
    step: IStep | undefined = currentStep[key],
  ) => utils.getPrevStep(steps[key]!, step)

  const getFirstStep = (key: string) => utils.getFirstStep(steps[key]!)

  const getLastStep = (key: string) => utils.getLastStep(steps[key]!)

  const isFirstStep = useMemo(() => {
    const obj: Ctx<boolean> = {} as Ctx<boolean>
    Object.keys(currentStep).forEach((key) => {
      obj[key] = currentStep[key] === getFirstStep(key)
    })
    return obj
  }, [currentStep])

  const isLastStep = useMemo(() => {
    const obj: Ctx<boolean> = {} as Ctx<boolean>
    Object.keys(currentStep).forEach((key) => {
      obj[key] = currentStep[key] === getLastStep(key)
    })
    return obj
  }, [currentStep])

  const _next = (key: string) => setCurrentStep(key, getNextStep(key)!)

  const _prev = (key: string) => setCurrentStep(key, getPrevStep(key)!)

  const _stop = (key: string) => {
    setVisible(key, false)
    setCurrentStep(key, undefined)
  }

  const registerStep = (key: string, step: IStep) => {
    setSteps((previousSteps) => {
      const newSteps = { ...previousSteps }
      newSteps[key] = {
        ...previousSteps[key],
        [step.name]: step,
      }
      return newSteps
    })
    if (!eventEmitter[key]) {
      eventEmitter[key] = new mitt()
    }
  }

  const unregisterStep = (key: string, stepName: string) => {
    if (!mounted) {
      return
    }
    setSteps((previousSteps) => {
      const newSteps = { ...previousSteps }
      newSteps[key] = Object.entries(previousSteps[key] as StepObject)
        .filter(([key]) => key !== stepName)
        .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
      return newSteps
    })
  }

  const getCurrentStep = (key: string) => currentStep[key]

  const start = async (
    key: string,
    fromStep?: number,
    _scrollRef?: React.RefObject<any>,
  ) => {
    if (!scrollRef) {
      setScrollRef(_scrollRef)
    }
    const currentStep = fromStep
      ? (steps[key] as StepObject)[fromStep]
      : getFirstStep(key)

    if (startTries.current > MAX_START_TRIES) {
      startTries.current = 0
      return
    }
    if (!currentStep) {
      startTries.current += 1
      requestAnimationFrame(() => start(key, fromStep))
    } else {
      eventEmitter[key]?.emit('start')
      await setCurrentStep(key, currentStep!)
      setVisible(key, true)
      startTries.current = 0
    }
  }
  const next = () => _next(tourKey)
  const prev = () => _prev(tourKey)
  const stop = () => _stop(tourKey)
  return (
    <View style={[styles.container, wrapperStyle]}>
      <TourGuideContext.Provider
        value={{
          eventEmitter,
          registerStep,
          unregisterStep,
          getCurrentStep,
          start,
          stop,
          canStart,
          setTourKey,
          registerHighlightedElementRef,
          unregisterHighlightedElementRef,
        }}
      >
        {children}
        <Modal
          ref={modal}
          {...{
            next,
            prev,
            stop,
            visible: visible[tourKey],
            isFirstStep: isFirstStep[tourKey],
            isLastStep: isLastStep[tourKey],
            currentStep: currentStep[tourKey],
            labels,
            tooltipComponent,
            tooltipStyle,
            androidStatusBarVisible,
            backdropColor,
            animationDuration,
            maskOffset,
            borderRadius,
            dismissOnPress,
            preventOutsideInteraction,
            persistTooltip,
            leaderLineConfig,
            // Pass the highlightedElementRef to the Modal
            highlightedElementRef: highlightedElementRef[tourKey],
          }}
        />
        {/* DEBUG: Logging de highlightedElementRef para LeaderLine */}
        {(() => {
          const currentRef = highlightedElementRef[tourKey]
          console.log(
            '🏹 TourGuideProvider: Pasando highlightedElementRef al Modal',
          )
          console.log('🏹 TourGuideProvider: tourKey:', tourKey)
          console.log(
            '🏹 TourGuideProvider: highlightedElementRef existe:',
            !!currentRef,
          )
          console.log(
            '🏹 TourGuideProvider: highlightedElementRef.current existe:',
            !!currentRef?.current,
          )
          if (currentRef?.current) {
            console.log(
              '🏹 TourGuideProvider: ✅ Elemento ref disponible para LeaderLine',
            )
          } else {
            console.log(
              '🏹 TourGuideProvider: ❌ Elemento ref NO disponible para LeaderLine',
            )
          }
          return null
        })()}
      </TourGuideContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
