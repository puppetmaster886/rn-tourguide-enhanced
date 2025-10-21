import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {TourGuideProvider, TourGuideZone, useTourGuideController} from '../src';
import type {TooltipProps} from '../src';

// Define custom data type for tooltips
interface CustomTooltipData {
  title: string;
  emoji?: string;
  backgroundColor?: string;
}

// Custom Tooltip Component
function CustomTooltip({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
  labels,
  connectionRef,
  tooltipCustomData,
}: TooltipProps<CustomTooltipData>) {
  const backgroundColor = tooltipCustomData?.backgroundColor || '#ffffff';
  const emoji = tooltipCustomData?.emoji || '🎯';
  const title = tooltipCustomData?.title || 'Tour Guide';

  return (
    <View ref={connectionRef} style={[styles.tooltip, {backgroundColor}]}>
      <View collapsable={false}>
        <Text style={styles.tooltipTitle}>
          {emoji} {title}
        </Text>
        <Text style={styles.tooltipText}>{currentStep?.text}</Text>
        <View style={styles.buttonRow}>
          {!isFirstStep && (
            <TouchableOpacity
              onPress={handlePrev}
              style={styles.buttonSecondary}>
              <Text style={styles.buttonSecondaryText}>
                {labels?.previous || 'Previous'}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleStop} style={styles.buttonOutline}>
            <Text style={styles.buttonOutlineText}>
              {labels?.skip || 'Skip'}
            </Text>
          </TouchableOpacity>
          {!isLastStep ? (
            <TouchableOpacity onPress={handleNext} style={styles.buttonPrimary}>
              <Text style={styles.buttonPrimaryText}>
                {labels?.next || 'Next'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleStop} style={styles.buttonSuccess}>
              <Text style={styles.buttonPrimaryText}>
                {labels?.finish || 'Finish'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

function Section({children, title}: any) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{children}</Text>
    </View>
  );
}

function AppContent() {
  const {start, stop, eventEmitter} = useTourGuideController();

  React.useEffect(() => {
    if (eventEmitter) {
      const handleStepChange = (_event: any) => {};
      eventEmitter.on('stepChange', handleStepChange);
      return () => eventEmitter.off('stepChange', handleStepChange);
    }
  }, [eventEmitter]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <View style={styles.sectionSpacing}>
          <TourGuideZone
            zone={1}
            text="This is the first step of the tour! Edit App.tsx to customize."
            tooltipPosition="centered"
            borderRadius={16}
            tooltipCustomData={{
              title: 'Welcome',
              emoji: '👋',
              backgroundColor: '#E3F2FD',
            }}
            leaderLineConfig={{
              endPlugOffset: 10,
              startPlugOffset: 5,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.tsx</Text> to change this
              screen and then come back to see your edits.
            </Section>
          </TourGuideZone>
        </View>

        <View style={styles.sectionSpacing}>
          <TourGuideZone
            zone={2}
            text="Custom tooltips with your own colors and emojis!"
            tooltipPosition="centered"
            shape="rectangle"
            leaderLineConfig={{
              color: '#4CAF50',
              endPlugColor: '#4CAF50',
              size: 4,
              endPlugSize: 14,
              endPlug: 'arrow1',
              path: 'arc',
            }}
            tooltipCustomData={{
              title: 'Live Reload',
              emoji: '🌱',
              backgroundColor: '#E8F5E9',
            }}>
            <Section title="See Your Changes">
              When you make changes, you'll see them here!
            </Section>
          </TourGuideZone>
        </View>

        <View style={styles.buttonContainer}>
          <TourGuideZone
            zone={3}
            text="Press the play button to start the tour!"
            tooltipPosition="centered"
            shape="circle"
            tooltipCustomData={{title: 'Start', emoji: '▶️'}}
            leaderLineConfig={{
              color: 'black',
              endPlugColor: 'black',
              size: 6,
              endPlugSize: 20,
              endPlugOffset: 4,
              endPlug: 'lineArrowWide',
              endSocket: 'right',
              startSocket: 'top',
              path: 'magnet',
            }}>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => start()}>
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
            text="Use this button to stop the tour!"
            tooltipPosition="centered"
            shape="circle"
            tooltipCustomData={{title: 'Stop', emoji: '⏹️'}}
            tooltipBottomOffset={-30}
            leaderLineConfig={{
              color: 'blue',
              endPlugColor: 'blue',
              size: 4,
              endPlugSize: 14,
              endPlug: 'star',
              startSocket: 'top',
              endSocket: 'bottom',
              path: 'fluid',
            }}>
            <View style={styles.iconWrapper}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => stop()}>
                <MaterialIcons name="stop-circle" size={80} color="#F44336" />
              </TouchableOpacity>
            </View>
          </TourGuideZone>
        </View>

        <View style={styles.sectionSpacing}>
          <TourGuideZone
            zone={5}
            text="Read the docs to learn about all features!"
            shape="ellipse"
            tooltipCustomData={{title: 'Docs', emoji: '📚'}}
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
      </ScrollView>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <TourGuideProvider<CustomTooltipData>
      tooltipComponent={CustomTooltip}
      androidStatusBarVisible={true}
      backdropColor="rgba(0, 0, 0, 0.7)">
      <AppContent />
    </TourGuideProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sectionSpacing: {
    marginTop: 16,
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionDescription: {
    marginTop: 6,
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
  },
  highlight: {
    fontWeight: '700',
    color: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Tooltip styles
  tooltip: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minWidth: 260,
  },
  tooltipTitle: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tooltipText: {
    color: '#4a4a4a',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  buttonSecondary: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    flex: 1,
  },
  buttonSuccess: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  buttonSecondaryText: {
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  buttonOutlineText: {
    color: '#FF6B6B',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default App;
