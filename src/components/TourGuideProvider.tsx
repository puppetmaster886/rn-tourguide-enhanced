import mitt from 'mitt'
import React, { useMemo, useEffect, useState, useRef } from 'react'
import {
  Dimensions,
  findNodeHandle,
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import {
  initialWindowMetrics,
  SafeAreaInsetsContext,
} from 'react-native-safe-area-context'
import { useIsMounted } from '../hooks/useIsMounted'
import { IStep, Labels, LeaderLineConfig, StepObject, Steps } from '../types'
import * as utils from '../utilities'
import { Modal } from './Modal'
import { OFFSET_WIDTH } from './style'
import { TooltipProps } from './Tooltip'
import { Ctx, TourGuideContext, Emitter } from './TourGuideContext'

/*
This is the maximum wait time for the steps to be registered before starting the tutorial
At 60fps means 2 seconds
*/
const MAX_START_TRIES = 120

/**
 * Props accepted by {@link TourGuideProvider}, allowing you to customize tooltip visuals, behavior, i18n, and LeaderLine wiring.
 *
 * @template TCustomData Type passed through tooltip props for advanced customization.
 * @property {React.ComponentType<TooltipProps<TCustomData>>} [tooltipComponent] Optional custom tooltip component; use when the default bubble does not match your design.
 * @property {StyleProp<ViewStyle>} [tooltipStyle] Style override applied to the default tooltip container; ignored when providing `tooltipComponent`.
 * @property {Labels} [labels] Internationalization map for the tooltip buttons; defaults to the library’s English labels.
 * @property {boolean} [androidStatusBarVisible] @deprecated Use `statusBarOffset` instead. Indicates whether the Android status bar stays visible during a tour (used to infer offset adjustments).
 * @property {number} [statusBarOffset] Optional manual override for status bar / safe area compensation applied to highlight positioning.
 * @property {string | boolean} [startAtMount=false] Auto-start behavior: `false` disables auto-start, `true` starts the `_default` tour, and a string starts the specified `tourKey`.
 * @property {string} [backdropColor] CSS color used for the dimmed overlay; defaults to the built-in semi-transparent black.
 * @property {number} [verticalOffset=0] Pixel offset applied to the highlighted area to fine tune tooltip positioning.
 * @property {StyleProp<ViewStyle>} [wrapperStyle] Style override for the provider’s root view container.
 * @property {number} [maskOffset] Extra padding around highlighted targets; defaults to the internal mask spacing.
 * @property {number} [borderRadius] Corner radius applied to rectangular highlights; defaults to the built-in value.
 * @property {number} [animationDuration] Duration in milliseconds for tooltip/mask transitions; defaults to the library’s smooth timing.
 * @property {React.ReactNode} children Required subtree that will be wrapped by the provider so the tour context is available.
 * @property {boolean} [dismissOnPress=false] When true any tap outside the tooltip stops the tour.
 * @property {boolean} [preventOutsideInteraction=false] Blocks touches outside the tooltip/target while the tour runs; defaults to `false`.
 * @property {boolean} [persistTooltip=false] Keeps the tooltip mounted during step transitions for smoother animations.
 * @property {LeaderLineConfig} [leaderLineConfig] Default LeaderLine settings (color, size, plugs, etc.) applied to every zone unless overridden.
 */
export interface TourGuideProviderProps<TCustomData = any> {
  tooltipComponent?: React.ComponentType<TooltipProps<TCustomData>>
  tooltipStyle?: StyleProp<ViewStyle>
  labels?: Labels
  /**
   * @deprecated Use `statusBarOffset` instead.
   */
  androidStatusBarVisible?: boolean
  statusBarOffset?: number
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

/**
 * Wraps your application with the tour context, orchestrates tooltip rendering, and exposes shared event emitters to `useTourGuideController`.
 *
 * @template TCustomData Custom data type forwarded to tooltip components.
 * @param {TourGuideProviderProps<TCustomData>} props Component props.
 * @param {React.ReactNode} props.children Required tree that should inherit tour capabilities.
 * @param {StyleProp<ViewStyle>} [props.wrapperStyle] Optional provider container style; defaults to flex fill.
 * @param {Labels} [props.labels] Optional label overrides for tooltip buttons.
 * @param {React.ComponentType<TooltipProps<TCustomData>>} [props.tooltipComponent] Custom tooltip renderer.
 * @param {StyleProp<ViewStyle>} [props.tooltipStyle] Style override for the default tooltip when `tooltipComponent` is not provided.
 * @param {boolean} [props.androidStatusBarVisible] @deprecated Use `statusBarOffset` to override offsets directly.
 * @param {number} [props.statusBarOffset] Manual override for status bar / safe area compensation.
 * @param {string} [props.backdropColor] Overlay color (defaults to built-in dimmed background).
 * @param {number} [props.animationDuration] Tooltip/mask animation duration in ms; defaults to library timing.
 * @param {number} [props.maskOffset] Extra padding around highlighted targets; defaults to `undefined` (library spacing).
 * @param {number} [props.borderRadius] Rectangular highlight radius (default internal value).
 * @param {number} [props.verticalOffset=0] Offset applied to highlight measurements.
 * @param {string | boolean} [props.startAtMount=false] Auto-start behavior (`false`, `true`, or specific tour key).
 * @param {boolean} [props.dismissOnPress=false] Stops tour on overlay press when enabled.
 * @param {boolean} [props.preventOutsideInteraction=false] Disables touches outside tooltips when true.
 * @param {boolean} [props.persistTooltip=false] Keeps tooltips mounted during transitions for smoother animations.
 * @param {LeaderLineConfig} [props.leaderLineConfig] Default LeaderLine settings applied to zones.
 * @returns {JSX.Element} React element that provides context plus the modal/tooltip overlay wiring.
 * @example
 * ```tsx
 * const App = () => (
 *   <TourGuideProvider
 *     labels={{ next: 'Next', finish: 'Done' }}
 *     backdropColor="rgba(0,0,0,0.8)"
 *     leaderLineConfig={{ color: '#fff' }}
 *   >
 *     <MainNavigator />
 *   </TourGuideProvider>
 * )
 * ```
 * @see https://puppetmaster886.github.io/rn-tourguide-enhanced/api-reference#tourguideprovider
 */
export const TourGuideProvider = <TCustomData = any,>({
  children,
  wrapperStyle,
  labels,
  tooltipComponent,
  tooltipStyle,
  androidStatusBarVisible,
  statusBarOffset,
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
}: TourGuideProviderProps<TCustomData>) => {
  const [scrollRef, setScrollRef] = useState<React.RefObject<any>>()
  const [activeTourKey, setActiveTourKey] = useState<string | undefined>(
    undefined,
  )
  const [visible, updateVisible] = useState<Ctx<boolean | undefined>>({
    _default: false,
  })
  const setVisible = (key: string, value: boolean) =>
    updateVisible((visible) => {
      const newVisible = { ...visible }
      newVisible[key] = value
      if (value) {
        setActiveTourKey(key)
      } else if (activeTourKey === key) {
        setActiveTourKey(undefined)
      }
      return newVisible
    })
  const [currentStep, updateCurrentStep] = useState<
    Ctx<IStep<TCustomData> | undefined>
  >({
    _default: undefined,
  })
  const [steps, setSteps] = useState<Ctx<Steps<TCustomData>>>({ _default: [] })

  const [canStart, setCanStart] = useState<Ctx<boolean>>({ _default: false })

  const [windowIsResized, setWindowResized] = useState(false)

  // Add state to track the highlighted element ref for LeaderLine
  const [highlightedElementRef, setHighlightedElementRef] = useState<
    Ctx<React.RefObject<View> | undefined>
  >({ _default: undefined })
  const safeAreaInsets = React.useContext(SafeAreaInsetsContext)

  // Function to register highlighted element ref
  const registerHighlightedElementRef = (
    key: string,
    ref: React.RefObject<View>,
  ) => {
    setHighlightedElementRef((prev) => {
      const newRefs = {
        ...prev,
        [key]: ref,
      }
      return newRefs
    })
  }

  // Function to unregister highlighted element ref
  const unregisterHighlightedElementRef = (key: string) => {
    setHighlightedElementRef((prev) => {
      const newRefs = { ...prev }
      delete newRefs[key]
      return newRefs
    })
  }

  const startTries = useRef<number>(0)
  const { current: mounted } = useIsMounted()

  const { current: eventEmitter } = useRef<Ctx<Emitter>>({
    _default: mitt(),
  })

  const modal = useRef<any>()

  useEffect(() => {
    if (mounted && activeTourKey && visible[activeTourKey] === false) {
      eventEmitter[activeTourKey]?.emit('stop')
    }
  }, [visible, activeTourKey, mounted, eventEmitter])

  useEffect(() => {
    if (
      activeTourKey &&
      (visible || (windowIsResized && currentStep) || currentStep)
    ) {
      moveToCurrentStep(activeTourKey)
      setWindowResized(false)
    }
  }, [visible, currentStep, windowIsResized, activeTourKey])

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
      // Update canStart for all tour keys
      Object.keys(steps).forEach((key) => {
        const stepData = steps[key]
        if (
          (Array.isArray(stepData) && stepData.length > 0) ||
          (!Array.isArray(stepData) && Object.entries(stepData).length > 0)
        ) {
          setCanStart((obj) => {
            const newObj = { ...obj }
            newObj[key] = true
            return newObj
          })
        } else {
          setCanStart((obj) => {
            const newObj = { ...obj }
            newObj[key] = false
            return newObj
          })
        }
      })

      // Handle startAtMount
      if (typeof startAtMount === 'string') {
        start(startAtMount)
      } else if (startAtMount) {
        start('_default')
      }
    }
  }, [mounted, steps])

  const resolvedStatusBarOffset = useMemo(() => {
    if (typeof statusBarOffset === 'number') {
      return statusBarOffset
    }

    if (Platform.OS === 'ios') {
      return safeAreaInsets?.top ?? initialWindowMetrics?.insets.top ?? 0
    }

    if (Platform.OS === 'android') {
      if (
        androidStatusBarVisible === false ||
        androidStatusBarVisible === undefined
      ) {
        return StatusBar.currentHeight ?? 0
      }
      return 0
    }

    return 0
  }, [androidStatusBarVisible, safeAreaInsets?.top, statusBarOffset])

  const moveToCurrentStep = async (key: string) => {
    const size = await currentStep[key]?.target.measure()

    if (
      size === undefined ||
      isNaN(size.width) ||
      isNaN(size.height) ||
      isNaN(size.x) ||
      isNaN(size.y)
    ) {
      return
    }

    const moveParams = {
      width: size.width + OFFSET_WIDTH,
      height: size.height + OFFSET_WIDTH,
      left: Math.round(size.x) - OFFSET_WIDTH / 2,
      top:
        Math.round(size.y) -
        OFFSET_WIDTH / 2 +
        (verticalOffset || 0) -
        resolvedStatusBarOffset,
    }

    // Execute animations sequentially to avoid conflicts between SvgMask and Modal animations
    try {
      await modal.current?.animateMove(moveParams)

      // Small delay to ensure animations stabilize
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Force final re-render to ensure visibility
      if (modal.current) {
        setTimeout(() => {
          if (modal.current) {
            modal.current.forceUpdate()
          }
        }, 50)
      }
    } catch (error) {
      // Animation error - safely ignore
    }
  }

  const setCurrentStep = async (key: string, step?: IStep<TCustomData>) =>
    new Promise<void>(async (resolve) => {
      if (scrollRef && step) {
        await step.wrapper.measureLayout(
          findNodeHandle(scrollRef.current),
          (_x: number, y: number, _w: number, h: number) => {
            const yOffsett = y > 0 ? y - h / 2 : 0
            scrollRef.current.scrollTo({ y: yOffsett, animated: false })
          },
        )
        setTimeout(() => {
          updateCurrentStep((currentStep) => {
            const newStep = { ...currentStep }
            newStep[key] = step
            eventEmitter[key]?.emit('stepChange', step)
            return newStep
          })
          resolve()
        }, 100)
      } else {
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
    step: IStep<TCustomData> | undefined = currentStep[key],
  ) => utils.getNextStep(steps[key]!, step)

  const getPrevStep = (
    key: string,
    step: IStep<TCustomData> | undefined = currentStep[key],
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
    eventEmitter[key]?.emit('stop')
    setVisible(key, false)
    setCurrentStep(key, undefined)
  }

  const registerStep = (key: string, step: IStep<TCustomData>) => {
    setSteps((previousSteps) => {
      const newSteps = { ...previousSteps }
      newSteps[key] = {
        ...previousSteps[key],
        [step.name]: step,
      }
      return newSteps
    })
    if (!eventEmitter[key]) {
      eventEmitter[key] = mitt()
    }
  }

  const unregisterStep = (key: string, stepName: string) => {
    if (!mounted) {
      return
    }
    setSteps((previousSteps) => {
      const newSteps = { ...previousSteps }
      newSteps[key] = Object.entries(
        previousSteps[key] as StepObject<TCustomData>,
      )
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
      ? (steps[key] as StepObject<TCustomData>)[fromStep]
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
  const next = () => activeTourKey && _next(activeTourKey)
  const prev = () => activeTourKey && _prev(activeTourKey)
  const stop = () => activeTourKey && _stop(activeTourKey)

  // Enhanced context value with automatic eventEmitter initialization
  const contextValue = useMemo(() => {
    const proxiedEventEmitter = new Proxy(eventEmitter, {
      get: (target, key: string) => {
        if (!target[key]) {
          target[key] = mitt()
        }

        const result = target[key]
        return result
      },
    })

    return {
      eventEmitter: proxiedEventEmitter,
      registerStep,
      unregisterStep,
      getCurrentStep,
      start,
      stop,
      canStart,
      registerHighlightedElementRef,
      unregisterHighlightedElementRef,
    }
  }, [
    eventEmitter,
    registerStep,
    unregisterStep,
    getCurrentStep,
    start,
    stop,
    canStart,
    registerHighlightedElementRef,
    unregisterHighlightedElementRef,
  ])

  return (
    <View style={[styles.container, wrapperStyle]}>
      <TourGuideContext.Provider value={contextValue}>
        {children}
        <Modal
          ref={modal}
          {...{
            next,
            prev,
            stop,
            visible: activeTourKey ? visible[activeTourKey] : false,
            isFirstStep: activeTourKey ? isFirstStep[activeTourKey] : false,
            isLastStep: activeTourKey ? isLastStep[activeTourKey] : false,
            currentStep: activeTourKey ? currentStep[activeTourKey] : undefined,
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
            highlightedElementRef: activeTourKey
              ? highlightedElementRef[activeTourKey]
              : undefined,
          }}
        />
      </TourGuideContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
