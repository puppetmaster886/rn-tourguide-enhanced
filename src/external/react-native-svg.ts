/**
 * External react-native-svg module resolver
 * This file ensures react-native-svg is resolved externally from the consuming app
 */

// Re-export todo desde react-native-svg pero como dependencia externa
export { Path, default as Svg } from 'react-native-svg'
export type { PathProps } from 'react-native-svg'
