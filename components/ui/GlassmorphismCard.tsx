import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme'; // Assuming you have this hook

type GlassmorphismCardProps = {
  children: React.ReactNode;
  style?: object;
};

export function GlassmorphismCard({ children, style }: GlassmorphismCardProps) {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';

  return (
    <View style={[styles.cardContainer, style]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 80} // Lower intensity for iOS for better visual
        tint={isLight ? 'light' : 'dark'}
        style={StyleSheet.absoluteFillObject}
      >
        <LinearGradient
          colors={isLight
            ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']
            : ['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </BlurView>
      {/* Content wrapper to ensure children are rendered on top of the blur/gradient */}
      <View style={styles.contentWrapper}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20, // Rounded corners for the glassmorphic card
    overflow: 'hidden', // Essential for blur and gradient to respect borderRadius
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)', // Subtle border for definition
    shadowColor: '#000', // General shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    // Add internal padding in the component using this, or a default here
    padding: 25, 
  },
  contentWrapper: {
    // This wrapper is crucial to ensure content is laid out *above* the BlurView and LinearGradient
    flex: 1,
  },
});