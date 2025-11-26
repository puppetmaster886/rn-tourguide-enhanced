import * as React from 'react'
import { View } from 'react-native'
import { IStep, ScrollPosition } from '../types'

export type Handler = (event?: any) => void
export interface Emitter {
  on(type: string, handler: Handler): void
  off(type: string, handler: Handler): void
  emit(type: string, event?: any): void
}
export type Ctx<T extends any> = Record<string, T> & { _default: T }

export interface ITourGuideContext<TCustomData = any> {
  eventEmitter?: Ctx<Emitter>
  canStart: Ctx<boolean>
  registerStep?(key: string, step: IStep<TCustomData>): void
  unregisterStep?(key: string, stepName: string): void
  getCurrentStep?(key: string): IStep<TCustomData> | undefined
  start?(
    key: string,
    fromStep?: number,
    scrollRef?: React.RefObject<any>,
    scrollPosition?: ScrollPosition,
  ): void
  stop?(key: string): void
  registerHighlightedElementRef?(key: string, ref: React.RefObject<View>): void
  unregisterHighlightedElementRef?(key: string): void
}

export const TourGuideContext = React.createContext<ITourGuideContext>({
  canStart: { _default: false },
})
