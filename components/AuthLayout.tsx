// File: components/AuthLayout.tsx
import React from 'react';
import { View, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';

interface AuthLayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  headerSubtitle: string;
}

export default function AuthLayout({ children, headerTitle, headerSubtitle }: AuthLayoutProps) {
  const colorScheme = useColorScheme();
  const primaryColor = Colors[colorScheme ?? 'light'].tint;

  return (
    <ThemedView style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('@/assets/images/auth-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
          <View style={styles.header}>
  <View style={[styles.logoContainer, { backgroundColor: primaryColor }]}>
    <Image
      source={require('@/assets/images/laundry-logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
  <ThemedText style={styles.headerTitle}>{headerTitle}</ThemedText>
  <ThemedText style={styles.headerSubtitle}>{headerSubtitle}</ThemedText>
</View>

        {/* Form Container with Glass Morphism */}
        <View style={styles.formContainer}>
          <BlurView
            intensity={Platform.OS === 'ios' ? 40 : 80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          >
            <LinearGradient
              colors={colorScheme === 'dark' 
                ? ['rgba(30,30,30,0.7)', 'rgba(50,50,50,0.5)'] 
                : ['rgba(255,255,255,0.7)', 'rgba(245,245,245,0.5)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </BlurView>
          {children}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 30,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 20,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
});