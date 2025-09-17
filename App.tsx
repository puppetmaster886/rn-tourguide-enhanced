import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import SimpleLeaderLineTest from './SimpleLeaderLineTest'
import {
  TourGuideProvider,
  TourGuideZone,
  TourGuideZoneByPosition,
  useTourGuideController,
} from './src'

const uri =
  'https://pbs.twimg.com/profile_images/1223192265969016833/U8AX9Lfn_400x400.jpg'

// Add <TourGuideProvider/> at the root of you app!
function App() {
  return (
    <TourGuideProvider
      {...{
        borderRadius: 16,
        androidStatusBarVisible: true,
        persistTooltip: true,
        // Basic LeaderLine configuration
        leaderLineConfig: {
          enabled: true,
          color: '#2980b9',
          size: 3,
          startPlug: 'disc',
          endPlug: 'arrow1',
        },
      }}
      preventOutsideInteraction
    >
      <AppContent />
    </TourGuideProvider>
  )
}

const AppContent = () => {
  const iconProps = { size: 40, color: '#888' }
  const scrollRef = React.useRef<ScrollView>(null)
  const [showSimpleTest, setShowSimpleTest] = React.useState(false)

  // Main tour controller
  const { start, canStart, stop, eventEmitter } = useTourGuideController()

  // Secondary tour controller with tourKey
  const {
    start: startAdvanced,
    canStart: canStartAdvanced,
    stop: stopAdvanced,
    eventEmitter: eventEmitterAdvanced,
  } = useTourGuideController('advanced')

  React.useEffect(() => {
    // start main tour at mount
    if (canStart) {
      start(1, scrollRef)
    }
  }, [canStart]) // wait until everything is registered

  React.useEffect(() => {
    if (eventEmitter) {
      const startHandler = () => console.log('Main tour started')
      const stopHandler = () => console.log('Main tour stopped')
      const stepChangeHandler = () => console.log('Main tour stepChange')

      eventEmitter.on('start', startHandler)
      eventEmitter.on('stop', stopHandler)
      eventEmitter.on('stepChange', stepChangeHandler)

      return () => {
        eventEmitter.off('start', startHandler)
        eventEmitter.off('stop', stopHandler)
        eventEmitter.off('stepChange', stepChangeHandler)
      }
    }
  }, [eventEmitter])

  React.useEffect(() => {
    if (eventEmitterAdvanced) {
      const startHandler = () => console.log('Advanced tour started')
      const stopHandler = () => console.log('Advanced tour stopped')
      const stepChangeHandler = () => console.log('Advanced tour stepChange')

      eventEmitterAdvanced.on('start', startHandler)
      eventEmitterAdvanced.on('stop', stopHandler)
      eventEmitterAdvanced.on('stepChange', stepChangeHandler)

      return () => {
        eventEmitterAdvanced.off('start', startHandler)
        eventEmitterAdvanced.off('stop', stopHandler)
        eventEmitterAdvanced.off('stepChange', stepChangeHandler)
      }
    }
  }, [eventEmitterAdvanced])

  // If showing simple test, render it instead
  if (showSimpleTest) {
    return <SimpleLeaderLineTest onGoBack={() => setShowSimpleTest(false)} />
  }

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps={'always'}
    >
      <View style={styles.container}>
        {/* Use TourGuideZone only to wrap */}
        <TourGuideZone
          keepTooltipPosition
          zone={2}
          text={'A react-native-copilot remastered! 🎉'}
          borderRadius={16}
          leaderLineConfig={{
            enabled: true,
            color: '#e74c3c',
            size: 4,
            startPlug: 'disc',
            endPlug: 'arrow2',
          }}
        >
          <Text style={styles.title}>
            {'Welcome to the demo of\n"rn-tourguide"'}
          </Text>
        </TourGuideZone>
        <View style={styles.middleView}>
          <TouchableOpacity style={styles.button} onPress={() => start()}>
            <Text style={styles.buttonText}>START THE TUTORIAL!</Text>
          </TouchableOpacity>

          {/* Simple LeaderLine Test Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#e74c3c' }]}
            onPress={() => setShowSimpleTest(true)}
          >
            <Text style={styles.buttonText}>TEST SIMPLE LEADERLINE</Text>
          </TouchableOpacity>

          <TourGuideZone
            zone={3}
            shape={'rectangle_and_keep'}
            leaderLineConfig={{
              enabled: true,
              color: '#f39c12',
              size: 5,
              startPlug: 'square',
              endPlug: 'arrow3',
            }}
          >
            <TouchableOpacity style={styles.button} onPress={() => start(4)}>
              <Text style={styles.buttonText}>Step 4</Text>
            </TouchableOpacity>
          </TourGuideZone>
          <TouchableOpacity style={styles.button} onPress={() => start(2)}>
            <Text style={styles.buttonText}>Step 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={stop}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>

          {/* Advanced Tour Controls */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#e67e22' }]}
            onPress={() => startAdvanced()}
          >
            <Text style={styles.buttonText}>START ADVANCED TOUR</Text>
          </TouchableOpacity>

          {/* Advanced Tour Zones */}
          <TourGuideZone
            tourKey='advanced'
            zone={1}
            shape='rectangle'
            text={
              'Advanced Tour: This is the first step of the advanced tutorial'
            }
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#8e44ad' }]}
            >
              <Text style={styles.buttonText}>Advanced Zone 1</Text>
            </TouchableOpacity>
          </TourGuideZone>

          <TourGuideZone
            tourKey='advanced'
            zone={2}
            shape='rectangle'
            text={
              'Advanced Tour: This demonstrates multiple independent tours running separately'
            }
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#27ae60' }]}
            >
              <Text style={styles.buttonText}>Advanced Zone 2</Text>
            </TouchableOpacity>
          </TourGuideZone>
          <TourGuideZone
            tourKey='advanced'
            zone={7}
            shape='rectangle'
            text={
              'Advanced Tour: Image with animated SVG morphing with awesome flubber 🍮💯'
            }
          >
            <Image source={{ uri }} style={styles.profilePhoto} />
          </TourGuideZone>
        </View>
        <View style={styles.row}>
          <TourGuideZone zone={4} shape={'circle'} tooltipBottomOffset={200}>
            <Ionicons name='ios-add-circle' {...iconProps} />
          </TourGuideZone>
          <Ionicons name='ios-chatbubbles' {...iconProps} />
          <Ionicons name='ios-globe' {...iconProps} />
          <TourGuideZone
            zone={5}
            leaderLineConfig={{
              enabled: true,
              color: '#27ae60',
              size: 2,
              startPlug: 'disc',
              endPlug: 'hand',
            }}
          >
            <Ionicons name='ios-navigate' {...iconProps} />
          </TourGuideZone>
          <TourGuideZone
            zone={6}
            shape={'circle'}
            leaderLineConfig={{
              enabled: false, // Disable LeaderLine for this step
            }}
          >
            <Ionicons name='ios-rainy' {...iconProps} />
          </TourGuideZone>
          <TourGuideZone
            tourKey='advanced'
            zone={8}
            shape={'rectangle'}
            text={
              'Advanced Tour: Enhanced Mask Offset with directional spacing: top=30, bottom=20, left=15, right=40'
            }
            maskOffset={{ top: 30, bottom: 20, left: 15, right: 40 }}
          >
            <Ionicons name='ios-star' {...iconProps} />
          </TourGuideZone>
          <TourGuideZone
            tourKey='advanced'
            zone={9}
            shape={'rectangle'}
            text={
              'Advanced Tour: Tooltip Left Offset positioned 400px from the left edge of the screen'
            }
            tooltipLeftOffset={400}
          >
            <Ionicons name='ios-heart' {...iconProps} />
          </TourGuideZone>
        </View>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              top: 250,
              left: 50,
              width: 64,
              height: 64,
              backgroundColor: 'red',
            },
          ]}
        />
        {Platform.OS !== 'web' ? (
          <TourGuideZoneByPosition
            zone={1}
            shape={'circle'}
            isTourGuide
            top={250}
            left={50}
            width={64}
            height={64}
          />
        ) : null}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginVertical: 20,
  },
  middleView: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  row: {
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
})

export default App
