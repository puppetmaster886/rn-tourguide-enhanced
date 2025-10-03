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

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

// Timestamp para verificar código actualizado
const APP_BUILD_TIMESTAMP = '2025-10-03_19:30:00_SVGMASK_SIMPLIFIED';

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
      const handleStepChange = (event: any) => {
        // Step changed
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
                color: '#4CAF50', // Verde para este step
                endPlugColor: '#4CAF50', // Flecha también verde
                size: 4, // Línea más gruesa
                endPlugSize: 14,
                endPlug: 'arrow1', // Flecha de estilo diferente
                path: 'arc', // Línea curva
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
                path: 'magnet', // Línea curva
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
                path: 'fluid', // Línea curva
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
                path: 'arc', // Línea curva
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
