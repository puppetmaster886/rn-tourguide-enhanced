import * as React from 'react';
const { useMemo } = React;
import { TourGuideContext } from '../components/TourGuideContext';
import { TourGuideZone, TourGuideZoneProps } from '../components/TourGuideZone';
import {
  TourGuideZoneByPosition,
  TourGuideZoneByPositionProps,
} from '../components/TourGuideZoneByPosition';

export const useTourGuideController = (tourKey?: string) => {
  const context = React.useContext(TourGuideContext);

  const { start, canStart, stop, eventEmitter, getCurrentStep } = context;

  const key = tourKey ?? '_default';

  const _start = (fromStep?: number, scrollRef?: React.RefObject<any>) => {
    if (start) {
      start(key, fromStep, scrollRef);
    }
  };
  const _stop = () => {
    if (stop) {
      stop(key);
    }
  };
  // Force access through Proxy to ensure eventEmitter[key] is initialized
  const _eventEmitter = useMemo(() => {
    if (eventEmitter) {
      const result = eventEmitter[key];
      return result;
    } else {
      return undefined;
    }
  }, [eventEmitter, key]);
  const _canStart = canStart ? canStart[key] : undefined;
  const _getCurrentStep = () => {
    if (getCurrentStep) {
      return getCurrentStep(key);
    }
    return undefined;
  };

  const KeyedTourGuideZone: React.FC<TourGuideZoneProps> =
    React.useCallback(
      ({ tourKey: zoneTourKey, children, ...rest }) => {
        return (
          <TourGuideZone {...rest} tourKey={zoneTourKey ?? key}>
            {children}
          </TourGuideZone>
        );
      },
      [key],
    );
  const KeyedTourGuideZoneByPosition: React.FC<TourGuideZoneByPositionProps> =
    React.useCallback(
      ({ tourKey: zoneTourKey, ...props }) => {
        return (
          <TourGuideZoneByPosition {...props} tourKey={zoneTourKey ?? key} />
        );
      },
      [key],
    );

  return {
    start: _start,
    stop: _stop,
    eventEmitter: _eventEmitter,
    getCurrentStep: _getCurrentStep,
    canStart: _canStart,
    tourKey: key,
    TourGuideZone: KeyedTourGuideZone,
    TourGuideZoneByPosition: KeyedTourGuideZoneByPosition,
  };
};
