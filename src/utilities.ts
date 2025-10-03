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
  // Validate inputs to prevent NaN
  if (
    !size ||
    !position ||
    isNaN(size.x) ||
    isNaN(size.y) ||
    isNaN(position.x) ||
    isNaN(position.y)
  ) {
    return 'M0,0 h 1 v 1 h -1 Z'
  }

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
  // Validate inputs to prevent NaN
  if (
    !size ||
    !position ||
    isNaN(size.x) ||
    isNaN(size.y) ||
    isNaN(position.x) ||
    isNaN(position.y)
  ) {
    return 'M0,0 a1 1 0 1 0 2 0 1 1 0 1 0-2 0'
  }

  // ⚠️ WARNING: Elementos con dimensiones 0 (como triángulos CSS)
  if (size.x === 0 || size.y === 0) {
    const minSize = 80
    const radius = minSize / 2
    return [
      `M${position.x - minSize / 8},${position.y + minSize / 2}`,
      `a${radius} ${radius} 0 1 0 ${radius * 2} 0 ${radius} ${radius} 0 1 0-${
        radius * 2
      } 0`,
    ].join('')
  }

  const radius = Math.round(Math.max(size.x, size.y) / 2)
  return [
    `M${position.x - size.x / 8},${position.y + size.y / 2}`,
    `a${radius} ${radius} 0 1 0 ${radius * 2} 0 ${radius} ${radius} 0 1 0-${
      radius * 2
    } 0`,
  ].join('')
}

export const ellipseSvgPath = ({
  size,
  position,
}: {
  size: ValueXY
  position: ValueXY
}): SvgPath => {
  // Validate inputs to prevent NaN
  if (
    !size ||
    !position ||
    isNaN(size.x) ||
    isNaN(size.y) ||
    isNaN(position.x) ||
    isNaN(position.y)
  ) {
    return 'M0,0 a1 1 0 1 0 2 0 1 1 0 1 0-2 0'
  }

  // ⚠️ WARNING: Elementos con dimensiones 0 (como triángulos CSS)
  if (size.x === 0 || size.y === 0) {
    const minSizeX = 100 // Ancho
    const minSizeY = 60 // Alto
    const radiusX = minSizeX / 2
    const radiusY = minSizeY / 2
    return [
      `M${position.x - minSizeX / 8},${position.y + minSizeY / 2}`,
      `a${radiusX} ${radiusY} 0 1 0 ${
        radiusX * 2
      } 0 ${radiusX} ${radiusY} 0 1 0-${radiusX * 2} 0`,
    ].join('')
  }

  const radiusX = Math.round(size.x / 2)
  const radiusY = Math.round(size.y / 2)
  return [
    `M${position.x - size.x / 8},${position.y + size.y / 2}`,
    `a${radiusX} ${radiusY} 0 1 0 ${
      radiusX * 2
    } 0 ${radiusX} ${radiusY} 0 1 0-${radiusX * 2} 0`,
  ].join('')
}

const getMaxSegmentLength = memoize((shape: Shape) => {
  switch (shape) {
    case 'circle':
    case 'ellipse':
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
  if (!maskOffset) {
    return size
  }

  const normalized = normalizeMarkOffset(maskOffset)
  return {
    x: size.x + normalized.left + normalized.right,
    y: size.y + normalized.top + normalized.bottom,
  }
})

const positionOffsetEnhanced = memoize(
  (position: ValueXY, maskOffset?: MaskOffset) => {
    if (!maskOffset) {
      return position
    }

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

    const getEllipseInterpolator = () =>
      interpolate(
        previousPath,
        ellipseSvgPath({
          size: sizeOffsetEnhanced(size, maskOffset),
          position,
        }),
        options,
      )

    switch (shape) {
      case 'circle':
        return getCircleInterpolator()
      case 'ellipse':
        return getEllipseInterpolator()
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
  // Validate position and size to prevent NaN in path
  if (
    !position ||
    !size ||
    isNaN(position.x) ||
    isNaN(position.y) ||
    isNaN(size.x) ||
    isNaN(size.y)
  ) {
    return previousPath
  }

  // Si la animación está completa, usar la función simplificada
  const animValue = clamp(animation._value, 0, 1)
  if (animValue >= 0.99) {
    // Extraer dimensiones del canvas del previousPath
    const canvasMatch = previousPath.match(
      /M0,0H(\d+(?:\.\d+)?)V(\d+(?:\.\d+)?)H0V0Z/,
    )
    if (canvasMatch) {
      const canvasWidth = parseFloat(canvasMatch[1])
      const canvasHeight = parseFloat(canvasMatch[2])
      const offset = typeof maskOffset === 'number' ? maskOffset : 0

      return createMaskPathWithHole(
        canvasWidth,
        canvasHeight,
        position,
        size,
        offset,
        borderRadius || 0,
        shape, // ⭐ CRÍTICO: Pasar el shape para que se aplique!
      )
    }
  }

  // Default shape to 'rectangle' if undefined
  const safeShape = shape || 'rectangle'

  // Use enhanced interpolator that supports both number and object maskOffset
  const interpolator = getInterpolatorEnhanced(
    cleanPath(previousPath),
    safeShape,
    position,
    size,
    maskOffset,
    borderRadius,
    borderRadiusObject,
  )

  const canvasPath = getCanvasPath(previousPath)

  const interpolatedPath = interpolator(animValue)

  // Validate interpolated path doesn't contain NaN
  if (
    typeof interpolatedPath === 'string' &&
    interpolatedPath.includes('NaN')
  ) {
    const fallbackPath = defaultSvgPath({
      size,
      position,
      borderRadius: borderRadius || 0,
      borderRadiusObject,
    })
    return `${canvasPath}${fallbackPath}`
  }

  // Handle array result from interpolator (for _and_keep shapes)
  const pathString = Array.isArray(interpolatedPath)
    ? interpolatedPath.join('')
    : interpolatedPath

  // More thorough NaN detection
  const hasNaN =
    pathString.includes('NaN') ||
    pathString.includes(' N') ||
    /\sNaN|\sN[^0-9]/.test(pathString)

  if (hasNaN) {
    const fallbackPath = defaultSvgPath({
      size,
      position,
      borderRadius: borderRadius || 0,
      borderRadiusObject,
    })
    return `${canvasPath}${fallbackPath}`
  }

  const result = `${canvasPath}${pathString}`

  // ULTRA paranoid final check
  if (result.includes('NaN')) {
    const fallbackPath = defaultSvgPath({
      size,
      position,
      borderRadius: borderRadius || 0,
      borderRadiusObject,
    })
    return `${canvasPath}${fallbackPath}`
  }

  return result
}

// Helper function to create SVG path with hole for highlighted element
export const createMaskPathWithHole = (
  canvasWidth: number,
  canvasHeight: number,
  holePosition: ValueXY,
  holeSize: ValueXY,
  maskOffset: number = 0,
  borderRadius: number = 0,
  shape?: Shape, // ⭐ Nuevo parámetro para soportar diferentes shapes
): string => {
  // Validate inputs to prevent NaN in path
  if (
    !holePosition ||
    !holeSize ||
    isNaN(holePosition.x) ||
    isNaN(holePosition.y) ||
    isNaN(holeSize.x) ||
    isNaN(holeSize.y) ||
    isNaN(canvasWidth) ||
    isNaN(canvasHeight) ||
    isNaN(maskOffset) ||
    isNaN(borderRadius)
  ) {
    return `M0,0H${canvasWidth || 100}V${canvasHeight || 100}H0V0Z`
  }

  // Calculate hole bounds with offset
  let x = holePosition.x - maskOffset
  let y = holePosition.y - maskOffset
  let width = holeSize.x + maskOffset * 2
  let height = holeSize.y + maskOffset * 2

  // ⚠️ Para elementos con dimensiones 0 (triángulos CSS), usar tamaños mínimos
  // Esto solo debería pasar con elementos CSS especiales, no con iconos normales
  if (holeSize.x === 0 || holeSize.y === 0) {
    if (shape === 'ellipse') {
      width = 100 + maskOffset * 2
      height = 60 + maskOffset * 2
      x = holePosition.x - width / 2
      y = holePosition.y - height / 2
    } else if (shape === 'circle' || shape === 'circle_and_keep') {
      width = 80 + maskOffset * 2
      height = 80 + maskOffset * 2
      x = holePosition.x - width / 2
      y = holePosition.y - height / 2
    }
  }

  // Create path that fills entire canvas
  let path = `M0,0H${canvasWidth}V${canvasHeight}H0V0Z`

  // ⭐ NUEVO: Soportar diferentes shapes
  if (shape === 'circle' || shape === 'circle_and_keep') {
    // Para circle, usar el radio máximo + offset
    const radius = Math.max(width, height) / 2
    const centerX = x + width / 2
    const centerY = y + height / 2

    // Círculo usando arcos SVG (dos semicírculos)
    path += `M${centerX - radius},${centerY}`
    path += `a${radius},${radius} 0 1,0 ${radius * 2},0`
    path += `a${radius},${radius} 0 1,0 -${radius * 2},0Z`
  } else if (shape === 'ellipse') {
    // Para ellipse, usar radiusX y radiusY diferentes
    const radiusX = width / 2
    const radiusY = height / 2
    const centerX = x + width / 2
    const centerY = y + height / 2

    // Elipse usando arcos SVG
    path += `M${centerX - radiusX},${centerY}`
    path += `a${radiusX},${radiusY} 0 1,0 ${radiusX * 2},0`
    path += `a${radiusX},${radiusY} 0 1,0 -${radiusX * 2},0Z`
  } else if (borderRadius > 0) {
    // Rounded rectangle hole
    path += `M${x + borderRadius},${y}`
    path += `H${x + width - borderRadius}`
    path += `Q${x + width},${y} ${x + width},${y + borderRadius}`
    path += `V${y + height - borderRadius}`
    path += `Q${x + width},${y + height} ${x + width - borderRadius},${
      y + height
    }`
    path += `H${x + borderRadius}`
    path += `Q${x},${y + height} ${x},${y + height - borderRadius}`
    path += `V${y + borderRadius}`
    path += `Q${x},${y} ${x + borderRadius},${y}Z`
  } else {
    // Rectangular hole
    path += `M${x},${y}H${x + width}V${y + height}H${x}V${y}Z`
  }

  return path
}
