import * as React from 'react'
const { useMemo } = React
import { TourGuideContext } from '../components/TourGuideContext'
import { TourGuideZone, TourGuideZoneProps } from '../components/TourGuideZone'
import {
  TourGuideZoneByPosition,
  TourGuideZoneByPositionProps,
} from '../components/TourGuideZoneByPosition'
import type { ScrollPosition } from '../types'

/**
 * Creates a keyed controller that starts, stops, and observes onboarding tours from React components.
 *
 * @param {string} [tourKey='_default'] Optional identifier that scopes the controller to a specific tour; `_default` lets you control the primary tour instance.
 * @returns {object} controller API bound to the requested `tourKey`.
 * @property {(fromStep?: number, scrollRef?: React.RefObject<any>, scrollPosition?: ScrollPosition) => void} controller.start Imperative starter that optionally jumps to `fromStep`, can sync with a `scrollRef`, and can request scroll alignment (`top` | `middle` | `bottom` | `none`; defaults to `top` when a `scrollRef` is provided).
 * @property {() => void} controller.stop Stops the currently running tour for the bound `tourKey`.
 * @property {import('mitt').Emitter | undefined} controller.eventEmitter Shared mitt emitter for listening to `start`, `stop`, and `stepChange` events.
 * @property {() => import('../types').IStep | undefined} controller.getCurrentStep Retrieves the latest rendered step for the current tour, if any.
 * @property {boolean | undefined} controller.canStart Indicates whether all registered zones are ready so the tour can begin.
 * @property {string} controller.tourKey The resolved tour key that all returned helpers are bound to.
 * @property {React.FC<TourGuideZoneProps>} controller.TourGuideZone Convenience component that automatically injects `tourKey` into `TourGuideZone`.
 * @property {React.FC<TourGuideZoneByPositionProps>} controller.TourGuideZoneByPosition Similar helper for `TourGuideZoneByPosition`.
 * @example
 * ```tsx
 * const { canStart, start, TourGuideZone } = useTourGuideController('onboarding')
 *
 * React.useEffect(() => {
 *   if (canStart) {
 *     start(1)
 *   }
 * }, [canStart, start])
 *
 * return <TourGuideZone zone={1} text="Welcome!" />
 * ```
 * @see https://puppetmaster886.github.io/rn-tourguide-enhanced/api-reference#useTourGuideController
 */
export const useTourGuideController = (tourKey?: string) => {
  const context = React.useContext(TourGuideContext)

  const { start, canStart, stop, eventEmitter, getCurrentStep } = context

  const key = tourKey ?? '_default'

  const _start = (
    fromStep?: number,
    scrollRef?: React.RefObject<any>,
    scrollPosition?: ScrollPosition,
  ) => {
    if (start) {
      start(key, fromStep, scrollRef, scrollPosition)
    }
  }
  const _stop = () => {
    if (stop) {
      stop(key)
    }
  }
  // Force access through Proxy to ensure eventEmitter[key] is initialized
  const _eventEmitter = useMemo(() => {
    if (eventEmitter) {
      const result = eventEmitter[key]
      return result
    } else {
      return undefined
    }
  }, [eventEmitter, key])
  const _canStart = canStart ? canStart[key] : undefined
  const _getCurrentStep = () => {
    if (getCurrentStep) {
      return getCurrentStep(key)
    }
    return undefined
  }

  const KeyedTourGuideZone: React.FC<TourGuideZoneProps> = React.useCallback(
    ({ tourKey: zoneTourKey, children, ...rest }) => {
      return (
        <TourGuideZone {...rest} tourKey={zoneTourKey ?? key}>
          {children}
        </TourGuideZone>
      )
    },
    [key],
  )
  const KeyedTourGuideZoneByPosition: React.FC<TourGuideZoneByPositionProps> =
    React.useCallback(
      ({ tourKey: zoneTourKey, ...props }) => {
        return (
          <TourGuideZoneByPosition {...props} tourKey={zoneTourKey ?? key} />
        )
      },
      [key],
    )

  return {
    start: _start,
    stop: _stop,
    eventEmitter: _eventEmitter,
    getCurrentStep: _getCurrentStep,
    canStart: _canStart,
    tourKey: key,
    TourGuideZone: KeyedTourGuideZone,
    TourGuideZoneByPosition: KeyedTourGuideZoneByPosition,
  }
}
