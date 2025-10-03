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

// Note: For web build, we'll use a simpler color scheme
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
            marginBottom: 15,
            textAlign: 'center',
          }}>
          Step {currentStep?.order} of {currentStep?.totalSteps}
        </Text>
        
        <Text
          style={{
            color: '#e0e0e0',
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 20,
          }}>
          {currentStep?.text}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={handlePrev}
            disabled={isFirstStep}
            style={[
              styles.tooltipButton,
              {
                backgroundColor: isFirstStep ? '#4a4a4a' : '#0f3c70',
                opacity: isFirstStep ? 0.4 : 1,
              },
            ]}>
            <Text style={styles.tooltipButtonText}>
              {labels?.previous || 'Previous'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleStop} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>
              {labels?.skip || 'Skip'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.tooltipButton,
              {backgroundColor: isLastStep ? '#16a085' : '#0f3c70'},
            ]}>
            <Text style={styles.tooltipButtonText}>
              {isLastStep ? labels?.finish || 'Finish' : labels?.next || 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Using the controller to manage the tour
  const {
    canStart, // Returns true if the tour can start
    start, // Starts the tour
    stop, // Stops the tour
    eventEmitter, // For listening to custom events
  } = useTourGuideController();

  const CustomTourButton = () => (
    <TourGuideZone
      zone={8}
      text="Start your tour from this beautiful custom styled button!"
      shape="rectangle"
      borderRadius={25}>
      <TouchableOpacity
        style={styles.customButton}
        onPress={() => canStart && start()}>
        <Text style={styles.customButtonText}>🚀 Start Custom Tour</Text>
      </TouchableOpacity>
    </TourGuideZone>
  );

  return (
    <TourGuideProvider
      tooltipComponent={CustomTooltip}
      // Other props you want to pass
      androidStatusBarVisible={true}
      preventOutsideInteraction={true}
      backdropColor="rgba(0, 0, 0, 0.4)"
      labels={{
        skip: '⏭️ Skip',
        next: '➡️ Next',
        previous: '⬅️ Previous',
        finish: '✅ Finish',
      }}>
      <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          
          <View style={styles.container}>
            <Text style={[styles.title, {color: isDarkMode ? Colors.white : Colors.black}]}>
              🎯 Enhanced Tour Guide Demo
            </Text>
            
            <Text style={[styles.subtitle, {color: isDarkMode ? Colors.light : Colors.dark}]}>
              Experience smooth leader lines with enhanced features!
            </Text>

            {/* Simple step examples */}
            <View style={styles.demoSection}>
              <TourGuideZone
                zone={1}
                text="👋 Welcome! This is a simple introduction to the tour guide."
                shape="circle">
                <View style={styles.demoBox}>
                  <Text style={styles.demoText}>Step 1: Introduction</Text>
                </View>
              </TourGuideZone>

              <TourGuideZone
                zone={2}
                text="🎨 Notice how the leader line smoothly connects to this element!"
                shape="rectangle"
                borderRadius={10}>
                <View style={[styles.demoBox, styles.coloredBox]}>
                  <Text style={styles.demoText}>Step 2: Leader Lines</Text>
                </View>
              </TourGuideZone>

              <TourGuideZone
                zone={3}
                text="📱 This demonstrates responsive behavior across different screen sizes."
                shape="rectangle">
                <View style={[styles.demoBox, styles.wideBox]}>
                  <Text style={styles.demoText}>Step 3: Responsive Design</Text>
                </View>
              </TourGuideZone>
            </View>

            <CustomTourButton />

            {/* Additional content for scrolling demo */}
            <View style={styles.scrollableContent}>
              <TourGuideZone
                zone={4}
                text="📜 The tour automatically handles scrolling to bring elements into view!"
                shape="rectangle"
                borderRadius={15}>
                <View style={styles.scrollBox}>
                  <Text style={styles.demoText}>Step 4: Auto-Scroll</Text>
                </View>
              </TourGuideZone>

              <TourGuideZone
                zone={5}
                text="🎭 Custom mask shapes help focus attention on specific areas."
                shape="circle">
                <View style={styles.circularElement}>
                  <Text style={styles.demoText}>Step 5: Custom Shapes</Text>
                </View>
              </TourGuideZone>

              <TourGuideZone
                zone={6}
                text="⚡ Enhanced performance with optimized rendering and smooth animations."
                shape="rectangle">
                <View style={[styles.demoBox, styles.performanceBox]}>
                  <Text style={styles.demoText}>Step 6: Performance</Text>
                </View>
              </TourGuideZone>

              <TourGuideZone
                zone={7}
                text="🎯 Perfect for onboarding new users to your app's features!"
                shape="rectangle"
                borderRadius={20}>
                <View style={[styles.demoBox, styles.finalBox]}>
                  <Text style={styles.demoText}>Step 7: User Onboarding</Text>
                </View>
              </TourGuideZone>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, {color: isDarkMode ? Colors.light : Colors.dark}]}>
                Built with ❤️ using React Native
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TourGuideProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  demoSection: {
    marginBottom: 30,
  },
  demoBox: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bbdefb',
  },
  coloredBox: {
    backgroundColor: '#f3e5f5',
    borderColor: '#ce93d8',
  },
  wideBox: {
    backgroundColor: '#e8f5e8',
    borderColor: '#a5d6a7',
    paddingHorizontal: 40,
  },
  demoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  customButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 20,
    shadowColor: '#6200ea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollableContent: {
    marginTop: 30,
  },
  scrollBox: {
    backgroundColor: '#fff3e0',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffcc02',
  },
  circularElement: {
    backgroundColor: '#ffebee',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#f8bbd9',
  },
  performanceBox: {
    backgroundColor: '#e0f2f1',
    borderColor: '#4db6ac',
  },
  finalBox: {
    backgroundColor: '#fce4ec',
    borderColor: '#f06292',
  },
  tooltipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 80,
  },
  tooltipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    color: '#a0a0a0',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default App;