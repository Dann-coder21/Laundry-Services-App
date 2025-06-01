// AppRouterEntry.tsx (assuming .tsx for TypeScript)

import { Redirect, Stack } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  Dimensions,
  ViewProps,
  ViewStyle // Import ViewProps for typing
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LOADING_DURATION = 4500;
const NUM_DROPLETS = 70;
const DROPLET_BASE_SIZE = 10;

// --- AUTH STATUS HOOK ---
function useAuthStatus() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setTimeout(() => {
        setIsAuthenticated(false); // Set to true to test authenticated flow
        setIsLoading(false);
      }, LOADING_DURATION);
    };
    checkAuth();
  }, []);

  return { isLoading, isAuthenticated };
}

// --- TYPE FOR DROPLET STATE ---
interface DropletState {
  translateY: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  initialNumericScale: number;
  initialXPercent: string;
  driftX: Animated.Value;
}

// --- MAIN APP ROUTER ENTRY COMPONENT ---
export default function AppRouterEntry() {
  const { isLoading, isAuthenticated } = useAuthStatus();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // --- ANIMATION VALUES ---
  const spinValue = useRef(new Animated.Value(0)).current;
  const machineScaleValue = useRef(new Animated.Value(0.9)).current;
  const textOpacityValue = useRef(new Animated.Value(0)).current;
  const progressBarValue = useRef(new Animated.Value(0)).current;
  const backgroundWaterLevel = useRef(new Animated.Value(0)).current;
  const machineWaterEffectOpacity = useRef(new Animated.Value(0)).current;

  const droplets = useRef<DropletState[]>( // Explicitly type the ref's content
    Array(NUM_DROPLETS).fill(null).map(() => {
      const initialNumericScale = 0.4 + Math.random() * 0.8;
      return {
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(0),
        scale: new Animated.Value(initialNumericScale),
        initialNumericScale: initialNumericScale,
        initialXPercent: `${Math.random() * 98 + 1}%`,
        driftX: new Animated.Value((Math.random() - 0.5) * 10),
      };
    })
  ).current;

  const fabricIconOpacity = useRef(new Animated.Value(0)).current;
  const fabricIconTranslateY = useRef(new Animated.Value(20)).current;


  // --- ANIMATION LOGIC ---
  useEffect(() => {
    if (isLoading) {
      // Machine Drum Spin, Washing Machine Pulse, Text Fade-In, Progress Bar, Water Wave, Water in Machine, Fabric Icons
      // (These animation setups remain the same as your previous working version)
      Animated.loop(
        Animated.timing(spinValue, { toValue: 1, duration: 1800, easing: Easing.linear, useNativeDriver: true })
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(machineScaleValue, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(machineScaleValue, { toValue: 0.92, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
      Animated.timing(textOpacityValue, { toValue: 1, duration: 1000, delay: 200, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
      Animated.timing(progressBarValue, { toValue: 1, duration: LOADING_DURATION, easing: Easing.linear, useNativeDriver: false }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(backgroundWaterLevel, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          Animated.timing(backgroundWaterLevel, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(machineWaterEffectOpacity, { toValue: 1, duration: 1000, useNativeDriver: true, delay: 500 }),
          Animated.timing(machineWaterEffectOpacity, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
      Animated.loop(
        Animated.sequence([
            Animated.parallel([
                 Animated.timing(fabricIconOpacity, { toValue: 1, duration: 1500, useNativeDriver: true, delay: 700}),
                 Animated.timing(fabricIconTranslateY, { toValue: -10, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
            ]),
            Animated.parallel([
                 Animated.timing(fabricIconOpacity, { toValue: 0.3, duration: 1500, useNativeDriver: true}),
                 Animated.timing(fabricIconTranslateY, { toValue: 20, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
            ])
        ])
      ).start();


      // --- Droplet Animations ---
      droplets.forEach((droplet) => {
        const scaledDropletSize = DROPLET_BASE_SIZE * droplet.initialNumericScale;
        const startY = -Math.random() * screenHeight * 0.4 - scaledDropletSize;
        const endY = screenHeight + scaledDropletSize;

        const baseFallDuration = 3500 + Math.random() * 4000;
        const fallDuration = baseFallDuration / (droplet.initialNumericScale * 0.6 + 0.7);

        droplet.translateY.setValue(startY);
        droplet.opacity.setValue(0);

        Animated.loop(
          Animated.sequence([
            Animated.delay(Math.random() * fallDuration * 0.8),
            Animated.parallel([
              Animated.timing(droplet.translateY, { toValue: endY, duration: fallDuration, easing: Easing.linear, useNativeDriver: true }),
              Animated.sequence([
                Animated.timing(droplet.opacity, { toValue: 0.25 + Math.random() * 0.4, duration: fallDuration * 0.15, easing: Easing.in(Easing.ease), useNativeDriver: true }),
                Animated.delay(fallDuration * 0.7),
                Animated.timing(droplet.opacity, { toValue: 0, duration: fallDuration * 0.15, easing: Easing.out(Easing.ease), useNativeDriver: true }),
              ]),
            ]),
            Animated.parallel([
              Animated.timing(droplet.translateY, { toValue: startY, duration: 0, useNativeDriver: true }),
              Animated.timing(droplet.opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
            ]),
          ])
        ).start();

        const driftBaseDuration = 2800 + Math.random() * 3000;
        Animated.loop(
            Animated.sequence([
                Animated.timing(droplet.driftX, {
                    toValue: (Math.random() - 0.5) * (25 + scaledDropletSize * 0.5),
                    duration: driftBaseDuration / (droplet.initialNumericScale * 0.5 + 0.75),
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(droplet.driftX, {
                    toValue: (Math.random() - 0.5) * (25 + scaledDropletSize * 0.5),
                    duration: driftBaseDuration / (droplet.initialNumericScale * 0.5 + 0.75),
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
      });
    }
  // It's good practice to include all dependencies, but `droplets` itself (the ref object) doesn't change.
  // Its *contents* are used. For arrays in refs manipulated like this, often not strictly needed in dep array
  // unless the array identity itself were to change. screenHeight/Width are important.
  }, [isLoading, screenHeight, screenWidth]);


  // --- INTERPOLATED ANIMATION VALUES ---
  const drumSpin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const progressFill = progressBarValue.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const waterWaveHeight = backgroundWaterLevel.interpolate({ inputRange: [0, 1], outputRange: ['25%', '45%'] });


  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.backgroundWaterContainer}>
          <Animated.View style={[styles.backgroundWater, { height: waterWaveHeight }]} />
        </View>

        {droplets.map((droplet, index) => {
          // Define the animated style object with proper typing
     const dropletAnimatedStyle: any = { // TEMPORARY
  opacity: droplet.opacity,
  transform: [
    { translateY: droplet.translateY },
    { translateX: droplet.driftX },
    { scale: droplet.scale },
  ],
  left: droplet.initialXPercent,
};


          return (
            <Animated.View
              key={index}
              style={[
                styles.droplet,
                dropletAnimatedStyle, // Apply the typed animated style
              ]}
            />
          );
        })}
        
         <Animated.View style={[styles.fabricIconContainer, styles.fabricIcon1, {opacity: fabricIconOpacity, transform: [{translateY: fabricIconTranslateY}, {rotate: '-15deg'}] }]}>
            <MaterialCommunityIcons name="tshirt-crew-outline" size={40} color="#B39DDB" />
        </Animated.View>
         <Animated.View style={[styles.fabricIconContainer, styles.fabricIcon2, {opacity: fabricIconOpacity, transform: [{translateY: Animated.multiply(fabricIconTranslateY, -0.8)}, {rotate: '20deg'}] }]}>
            <MaterialCommunityIcons name="hanger" size={36} color="#B39DDB" />
        </Animated.View>
         <Animated.View style={[styles.fabricIconContainer, styles.fabricIcon3, {opacity: fabricIconOpacity, transform: [{translateY: Animated.multiply(fabricIconTranslateY, 0.6)}, {rotate: '5deg'}] }]}>
            <MaterialCommunityIcons name="washing-machine-alert" size={32} color="#B39DDB" />
        </Animated.View>
        
        <View style={styles.mainContent}>
          <Animated.View style={[styles.washingMachineOuter, { transform: [{ scale: machineScaleValue }] }]}>
            <View style={styles.washingMachine}>
              <View style={styles.machineTopDetail} />
              <View style={styles.drumContainer}>
                <Animated.View style={[styles.drum, { transform: [{ rotate: drumSpin }] }]}>
                  <Animated.View style={[styles.drumWaterEffect, { opacity: machineWaterEffectOpacity }]} />
                  <View style={[styles.clothes, styles.cloth1]} />
                  <View style={[styles.clothes, styles.cloth2]} />
                  <View style={[styles.clothes, styles.cloth3]} />
                </Animated.View>
              </View>
              <View style={styles.door}>
                <View style={styles.doorGlass} />
              </View>
              <View style={styles.controlPanel}>
                <View style={styles.controlKnob} />
                <View style={styles.controlButton} />
                <View style={styles.controlButton} />
              </View>
               <Text style={styles.brandName}>WashCycle</Text>
            </View>
          </Animated.View>
          <Animated.View style={[styles.loadingInfoCard, { opacity: textOpacityValue }]}>
            <Text style={styles.loadingTextPrimary}>Spinning up the Freshness!</Text>
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBarFill, { width: progressFill }]} />
            </View>
            <Text style={styles.loadingTextSecondary}>Getting your laundry cycle ready...</Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  // --- AUTHENTICATION REDIRECTS ---
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/login" />;
  }
}

// --- STYLESHEET ---
// (Styles remain unchanged from your previous version, as the problem is likely with TS types, not CSS-like styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    overflow: 'hidden',
  },
  droplet: {
    position: 'absolute',
    width: DROPLET_BASE_SIZE,
    height: DROPLET_BASE_SIZE,
    backgroundColor: 'rgba(220, 235, 255, 0.55)',
    borderRadius: DROPLET_BASE_SIZE / 2,
  },
  backgroundWaterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#64B5F6',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    overflow: 'hidden',
  },
  backgroundWater: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(100, 181, 246, 0.5)',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  fabricIconContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  fabricIcon1: { top: '15%', left: '10%' },
  fabricIcon2: { bottom: '55%', right: '8%' },
  fabricIcon3: { top: '60%', left: '20%' },
  mainContent: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  washingMachineOuter: {
    marginBottom: 30,
  },
  washingMachine: {
    width: 190,
    height: 230,
    backgroundColor: '#EDE7F6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 3,
    borderColor: '#D1C4E9',
  },
  machineTopDetail: {
    width: '70%',
    height: 15,
    backgroundColor: '#B39DDB',
    borderRadius: 8,
    marginBottom: 15,
  },
  drumContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#7986CB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#5C6BC0',
  },
  drum: {
    width: '95%',
    height: '95%',
    borderRadius: 60,
    backgroundColor: '#9FA8DA',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  drumWaterEffect: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(100, 181, 246, 0.5)',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  clothes: {
    position: 'absolute',
    borderRadius: 6,
  },
  cloth1: { width: 30, height: 40, backgroundColor: '#81C784', transform: [{ rotate: '20deg' }, { translateY: -5 }] },
  cloth2: { width: 25, height: 35, backgroundColor: '#FFD54F', transform: [{ rotate: '-35deg' }, { translateX: 10 }] },
  cloth3: { width: 32, height: 42, backgroundColor: '#E57373', transform: [{ rotate: '120deg' }, { translateY: 10 }] },
  door: {
    position: 'absolute',
    top: 47,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderColor: '#9575CD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doorGlass: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(224, 224, 224, 0.3)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlPanel: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B39DDB',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  controlKnob: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#7E57C2', marginRight: 6 },
  controlButton: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EDE7F6', marginHorizontal: 3 },
  brandName: { position: 'absolute', bottom: 20, left: 20, color: '#7E57C2', fontWeight: 'bold', fontSize: 14 },
  loadingInfoCard: {
    marginTop: 25,
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '85%',
  },
  loadingTextPrimary: { fontSize: 20, fontWeight: '700', color: '#5E35B1', marginBottom: 15, textAlign: 'center' },
  progressBarContainer: { width: '100%', height: 10, backgroundColor: '#D1C4E9', borderRadius: 5, overflow: 'hidden', marginBottom: 15 },
  progressBarFill: { height: '100%', backgroundColor: '#7E57C2', borderRadius: 5 },
  loadingTextSecondary: { fontSize: 14, color: '#78909C', textAlign: 'center', lineHeight: 20 },
});