import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Color scheme compatible with web and native
const Colors = {
  darker: '#1a1a1a',
  dark: '#3a3a3a',
  light: '#f3f3f3',
  lighter: '#ffffff',
  black: '#000000',
  white: '#ffffff',
  primary: '#007AFF',
};

import {TourGuideProvider, TourGuideZone, useTourGuideController} from '../src';
import type {TooltipProps} from '../src';

// Custom Tooltip Component with different padding/structure
// Demonstrates the use of connectionRef for precise LeaderLine connection
function CustomTooltip({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
  connectionRef, // Optional: Specify exact connection point for LeaderLine
}: TooltipProps) {
  return (
    <View
      ref={connectionRef}
      style={{
        backgroundColor: '#1a1a2e',
        borderRadius: 20,
        padding: 20, // Outer padding - LeaderLine will skip this
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#16213e',
      }}>
      <View collapsable={false}>
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 12,
            textAlign: 'center',
          }}>
          🎯 Custom Tooltip
        </Text>
        <Text style={{color: '#e0e0e0', fontSize: 14, textAlign: 'center'}}>
          {currentStep?.text}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
          }}>
          {!isFirstStep && (
            <TouchableOpacity
              onPress={handlePrev}
              style={{
                backgroundColor: '#0f3460',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>
                {labels?.previous || 'Previous'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleStop}
            style={{
              backgroundColor: '#e94560',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
            }}>
            <Text style={{color: '#fff', fontWeight: '600'}}>
              {labels?.skip || 'Skip'}
            </Text>
          </TouchableOpacity>
          {!isLastStep && (
            <TouchableOpacity
              onPress={handleNext}
              style={{
                backgroundColor: '#16213e',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>
                {labels?.next || 'Next'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

function Section({children, title}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const {start, stop, eventEmitter} = useTourGuideController();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  React.useEffect(() => {
    if (eventEmitter) {
      const handleStepChange = (_event: any) => {
        // Handle step change event
      };

      eventEmitter.on('stepChange', handleStepChange);

      return () => {
        eventEmitter.off('stepChange', handleStepChange);
      };
    }
  }, [eventEmitter]);

  const handleStartTour = () => {
    start();
  };

  const handleStopTour = () => {
    stop();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={styles.sectionSpacing}>
            <TourGuideZone
              zone={1}
              text="This is the first step of the tour!"
              tooltipPosition="centered"
              borderRadius={16}>
              <Section title="Step One">
                Edit <Text style={styles.highlight}>App.tsx</Text> to change
                this screen and then come back to see your edits.
              </Section>
            </TourGuideZone>
          </View>

          <View style={styles.sectionSpacing}>
            <TourGuideZone
              zone={2}
              text="This is the second step. You can customize the appearance!"
              tooltipPosition="centered"
              shape="rectangle"
              leaderLineConfig={{
                color: '#4CAF50',
                endPlugColor: '#4CAF50',
                size: 4,
                endPlugSize: 14,
                endPlug: 'arrow1',
                path: 'arc',
              }}>
              <Section title="See Your Changes">
                <Text>When you make changes, you'll see them here!</Text>
              </Section>
            </TourGuideZone>
          </View>

          <View style={styles.buttonContainer}>
            <TourGuideZone
              zone={3}
              text="Press the green play button to start the tour!"
              tooltipPosition="centered"
              shape="circle"
              maskOffset={5}
              leaderLineConfig={{
                color: 'black',
                endPlugColor: 'black',
                size: 6,
                endPlugSize: 14,
                endPlugOffset: 4,
                endPlug: 'lineArrowWide',
                endSocket: 'right',
                path: 'magnet',
              }}>
              <View style={styles.iconWrapper}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleStartTour}>
                  <MaterialIcons
                    name="play-circle-filled"
                    size={80}
                    color="#4CAF50"
                  />
                </TouchableOpacity>
              </View>
            </TourGuideZone>

            <TourGuideZone
              zone={4}
              text="Press the red stop button to end the tour!"
              tooltipPosition="centered"
              shape="circle"
              leaderLineConfig={{
                color: 'blue',
                endPlugColor: 'blue',
                size: 4,
                endPlugSize: 14,
                endPlug: 'lineArrow',
                startSocket: 'top',
                endSocket: 'bottom',
                path: 'fluid',
              }}>
              <View style={styles.iconWrapper}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleStopTour}>
                  <MaterialIcons name="stop-circle" size={80} color="#F44336" />
                </TouchableOpacity>
              </View>
            </TourGuideZone>
          </View>

          <View style={styles.sectionSpacing}>
            <TourGuideZone
              zone={5}
              text="Press the green play button to start the tour!"
              shape="ellipse"
              tooltipBottomOffset={100}
              leaderLineConfig={{
                color: 'grey',
                endPlugColor: 'grey',
                path: 'arc',
              }}
              maskOffset={5}>
              <Section title="Learn More">
                Read the docs to discover what to do next with your tour guide!
              </Section>
            </TourGuideZone>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <TourGuideProvider
      tooltipComponent={CustomTooltip}
      androidStatusBarVisible={true}>
      <AppContent />
    </TourGuideProvider>
  );
}

const styles = StyleSheet.create({
  sectionSpacing: {
    marginTop: 32,
  },
  sectionContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80, // Exact size matching icon
    height: 80, // Exact size matching icon
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
