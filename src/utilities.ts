// @ts-ignore
import { interpolate, separate, splitPathString, toCircle } from 'flubber'
import clamp from 'lodash.clamp'
import memoize from 'memoize-one'
import { Platform } from 'react-native'
import {
  BorderRadiusObject,
  IStep,
  MaskOffset,
  Shape,
  Steps,
  SVGMaskPathMorphParam,
  SvgPath,
  ValueXY,
} from './types'

export const IS_NATIVE = Platform.OS !== 'web'

export const getFirstStep = (steps: Steps): IStep | null =>
  steps &&
  Object.values(steps).reduce(
    (a: IStep | null, b) => (!a || a.order > b.order ? b : a),
    null,
  )

export const getLastStep = (steps: Steps): IStep | null =>
  steps &&
  Object.values(steps).reduce(
    (a: IStep | null, b) => (!a || a.order < b.order ? b : a),
    null,
  )

export const getStepNumber = (steps: Steps, step?: IStep): number | undefined =>
  step &&
  Object.values(steps).filter((_step) => _step.order <= step.order).length

export const getPrevStep = (steps: Steps, step?: IStep): IStep | null =>
  Object.values(steps)
    .filter((_step) => _step.order < step!.order)
    .reduce((a: IStep | null, b) => (!a || a.order < b.order ? b : a), null)

export const getNextStep = (
  steps: Steps,
  step?: IStep,
): IStep | null | undefined =>
  Object.values(steps)
    .filter((_step) => _step.order > step!.order)
    .reduce((a: IStep | null, b) => (!a || a.order > b.order ? b : a), null) ||
  step

const headPath = /^M0,0H\d*\.?\d*V\d*\.?\d*H0V0Z/
const cleanPath = memoize((path: string) => path.replace(headPath, '').trim())
const getCanvasPath = memoize((path: string) => {
  const canvasPath = path.match(headPath)
  if (canvasPath) {
    return canvasPath[0]
  }
  return ''
})

const getBorderRadiusOrDefault = (
  borderRadius?: number,
  defaultRadius: number = 0,
) => (borderRadius || borderRadius === 0 ? borderRadius : defaultRadius)

export const defaultSvgPath = ({
  size,
  position,
  borderRadius: radius,
  borderRadiusObject,
}: {
  size: ValueXY
  position: ValueXY
  borderRadius: number
  borderRadiusObject?: BorderRadiusObject
}): SvgPath => {
  if (radius || borderRadiusObject) {
    const borderRadiusTopRight = getBorderRadiusOrDefault(
      borderRadiusObject?.topRight,
      radius,
    )
    const borderRadiusTopLeft = getBorderRadiusOrDefault(
      borderRadiusObject?.topLeft,
      radius,
    )
    const borderRadiusBottomRight = getBorderRadiusOrDefault(
      borderRadiusObject?.bottomRight,
      radius,
    )
    const borderRadiusBottomLeft = getBorderRadiusOrDefault(
      borderRadiusObject?.bottomLeft,
      radius,
    )

    return `M${position.x},${position.y}H${
      position.x + size.x
    } a${borderRadiusTopRight},${borderRadiusTopRight} 0 0 1 ${borderRadiusTopRight},${borderRadiusTopRight}V${
      position.y + size.y - borderRadiusTopRight
    } a${borderRadiusBottomRight},${borderRadiusBottomRight} 0 0 1 -${borderRadiusBottomRight},${borderRadiusBottomRight}H${
      position.x
    } a${borderRadiusBottomLeft},${borderRadiusBottomLeft} 0 0 1 -${borderRadiusBottomLeft},-${borderRadiusBottomLeft}V${
      position.y +
      (borderRadiusBottomLeft > borderRadiusTopLeft
        ? borderRadiusTopLeft
        : borderRadiusBottomLeft)
    } a${borderRadiusTopLeft},${borderRadiusTopLeft} 0 0 1 ${borderRadiusTopLeft},-${borderRadiusTopLeft}Z`
  }
  return `M${position.x},${position.y}H${position.x + size.x}V${
    position.y + size.y
  }H${position.x}V${position.y}Z`
}

export const circleSvgPath = ({
  size,
  position,
}: {
  size: ValueXY
  position: ValueXY
}): SvgPath => {
  const radius = Math.round(Math.max(size.x, size.y) / 2)
  return [
    `M${position.x - size.x / 8},${position.y + size.y / 2}`,
    `a${radius} ${radius} 0 1 0 ${radius * 2} 0 ${radius} ${radius} 0 1 0-${
      radius * 2
    } 0`,
  ].join('')
}

const sizeOffset = memoize((size: ValueXY, maskOffset: number = 0) =>
  maskOffset
    ? {
        x: size.x + maskOffset,
        y: size.y + maskOffset,
      }
    : size,
)

const positionOffset = memoize((position: ValueXY, maskOffset: number = 0) =>
  maskOffset
    ? {
        x: position.x - maskOffset / 2,
        y: position.y - maskOffset / 2,
      }
    : position,
)

const getMaxSegmentLength = memoize((shape: Shape) => {
  switch (shape) {
    case 'circle':
    case 'circle_and_keep':
      return 7
    case 'rectangle_and_keep':
      return 25

    default:
      return 15
  }
})

const getSplitPathSliceOne = memoize((path: SvgPath) => {
  const splitPath = splitPathString(path)
  return splitPath.length > 1 ? splitPath.slice(1).join('') : path
})

const getInterpolator = memoize(
  (
    previousPath: string,
    shape: Shape,
    position: ValueXY,
    size: ValueXY,
    maskOffset: number = 0,
    borderRadius: number = 0,
    borderRadiusObject?: BorderRadiusObject,
  ) => {
    const options = {
      maxSegmentLength: getMaxSegmentLength(shape),
    }
    const optionsKeep = { single: true }
    const getDefaultInterpolate = () =>
      interpolate(
        previousPath,
        defaultSvgPath({
          size: sizeOffset(size, maskOffset),
          position: positionOffset(position, maskOffset),
          borderRadius,
          borderRadiusObject,
        }),
        options,
      )
    const getCircleInterpolator = () =>
      toCircle(
        previousPath,
        position.x + size.x / 2,
        position.y + size.y / 2,
        Math.max(size.x, size.y) / 2 + maskOffset,
        options,
      )

    switch (shape) {
      case 'circle':
        return getCircleInterpolator()
      case 'rectangle':
        return getDefaultInterpolate()
      case 'circle_and_keep': {
        const path = getSplitPathSliceOne(previousPath)
        return separate(
          previousPath,
          [
            path,
            circleSvgPath({ size: sizeOffset(size, maskOffset), position }),
          ],
          optionsKeep,
        )
      }

      case 'rectangle_and_keep': {
        const path = getSplitPathSliceOne(previousPath)
        return separate(
          previousPath,
          [
            path,
            defaultSvgPath({
              size: sizeOffset(size, maskOffset),
              position: positionOffset(position, maskOffset),
              borderRadius,
              borderRadiusObject,
            }),
          ],
          optionsKeep,
        )
      }
      default:
        return getDefaultInterpolate()
    }
  },
)

// Enhanced maskOffset functions for PR #61
const normalizeMarkOffset = (maskOffset?: MaskOffset) => {
  if (typeof maskOffset === 'number') {
    return {
      top: maskOffset,
      bottom: maskOffset,
      left: maskOffset,
      right: maskOffset,
    }
  }
  if (maskOffset && typeof maskOffset === 'object') {
    return {
      top: maskOffset.top || 0,
      bottom: maskOffset.bottom || 0,
      left: maskOffset.left || 0,
      right: maskOffset.right || 0,
    }
  }
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
}

const sizeOffsetEnhanced = memoize((size: ValueXY, maskOffset?: MaskOffset) => {
  if (!maskOffset) return size

  const normalized = normalizeMarkOffset(maskOffset)
  return {
    x: size.x + normalized.left + normalized.right,
    y: size.y + normalized.top + normalized.bottom,
  }
})

const positionOffsetEnhanced = memoize(
  (position: ValueXY, maskOffset?: MaskOffset) => {
    if (!maskOffset) return position

    const normalized = normalizeMarkOffset(maskOffset)
    return {
      x: position.x - normalized.left,
      y: position.y - normalized.top,
    }
  },
)

const getInterpolatorEnhanced = memoize(
  (
    previousPath: string,
    shape: Shape,
    position: ValueXY,
    size: ValueXY,
    maskOffset?: MaskOffset,
    borderRadius: number = 0,
    borderRadiusObject?: BorderRadiusObject,
  ) => {
    const options = {
      maxSegmentLength: getMaxSegmentLength(shape),
    }
    const optionsKeep = { single: true }

    // Handle enhanced maskOffset for circles
    const getCircleRadius = () => {
      if (!maskOffset) {
        return Math.max(size.x, size.y) / 2
      }

      if (typeof maskOffset === 'number') {
        return Math.max(size.x, size.y) / 2 + maskOffset
      }

      const normalized = normalizeMarkOffset(maskOffset)
      const avgOffset =
        (normalized.top +
          normalized.bottom +
          normalized.left +
          normalized.right) /
        4
      return Math.max(size.x, size.y) / 2 + avgOffset
    }

    const getDefaultInterpolate = () =>
      interpolate(
        previousPath,
        defaultSvgPath({
          size: sizeOffsetEnhanced(size, maskOffset),
          position: positionOffsetEnhanced(position, maskOffset),
          borderRadius,
          borderRadiusObject,
        }),
        options,
      )

    const getCircleInterpolator = () =>
      toCircle(
        previousPath,
        position.x + size.x / 2,
        position.y + size.y / 2,
        getCircleRadius(),
        options,
      )

    switch (shape) {
      case 'circle':
        return getCircleInterpolator()
      case 'rectangle':
        return getDefaultInterpolate()
      case 'circle_and_keep': {
        const path = getSplitPathSliceOne(previousPath)
        return separate(
          previousPath,
          [
            path,
            circleSvgPath({
              size: sizeOffsetEnhanced(size, maskOffset),
              position,
            }),
          ],
          optionsKeep,
        )
      }

      case 'rectangle_and_keep': {
        const path = getSplitPathSliceOne(previousPath)
        return separate(
          previousPath,
          [
            path,
            defaultSvgPath({
              size: sizeOffsetEnhanced(size, maskOffset),
              position: positionOffsetEnhanced(position, maskOffset),
              borderRadius,
              borderRadiusObject,
            }),
          ],
          optionsKeep,
        )
      }
      default:
        return getDefaultInterpolate()
    }
  },
)

export const svgMaskPathMorph = ({
  previousPath,
  animation,
  to: { position, size, shape, maskOffset, borderRadius, borderRadiusObject },
}: SVGMaskPathMorphParam) => {
  // Use enhanced interpolator that supports both number and object maskOffset
  const interpolator = getInterpolatorEnhanced(
    cleanPath(previousPath),
    shape!,
    position,
    size,
    maskOffset,
    borderRadius,
    borderRadiusObject,
  )

  return `${getCanvasPath(previousPath)}${interpolator(
    clamp(animation._value, 0, 1),
  )}`
}
