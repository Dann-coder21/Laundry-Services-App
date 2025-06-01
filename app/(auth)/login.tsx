// File: app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { Stack, useRouter, Link } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Added FontAwesome
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
// Colors import is not used, local colors are defined. This is fine.
// import { Colors } from '@/constants/Colors'; 
import { useColorScheme } from '@/hooks/useColorScheme';

export default function LoginPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Color definitions (mostly kept original, can be tweaked further if desired)
  const primaryColor = '#7B42F6'; // Purple
  const secondaryColor = '#5E35B1'; // Darker purple
  const backgroundLight = '#F5F7FF'; // Light purple background
  const backgroundDark = '#1A0D2E'; // Dark purple background
  const containerBg = isDarkMode ? backgroundDark : backgroundLight;
  const cardBg = isDarkMode ? '#2A1A4A' : '#FFFFFF';
  const inputBg = isDarkMode ? '#3A2258' : '#F8F7FF';
  const inputBorder = isDarkMode ? '#4D3370' : '#E6E1FF';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#333333';
  const textSecondary = isDarkMode ? '#A0A0A0' : '#666666';
  const placeholderColor = isDarkMode ? '#9B7EDE' : '#9B7EDE'; // Kept original, good contrast

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 500);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: containerBg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Background Gradient (for light mode) */}
          {!isDarkMode && (
            <LinearGradient
              colors={['#F5F7FF', '#E0E5FF']} // Slightly adjusted end color for subtlety
              style={styles.backgroundGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          
          <View style={styles.headerSection}>
            <ThemedText style={[styles.heroTitle, { color: primaryColor }]}>
              Welcome Back!
            </ThemedText>
            <ThemedText style={[styles.heroSubtitle, { color: textSecondary }]}>
              Sign in to continue your journey
            </ThemedText>
          </View>

          <View style={[
            styles.loginCard, 
            { 
              backgroundColor: cardBg,
              shadowColor: isDarkMode ? 'rgba(123, 66, 246, 0.5)' : 'rgba(123, 66, 246, 0.7)', // Primary color with alpha
            }
          ]}>
            <View style={styles.formContent}>
              <View style={[styles.inputContainer, { 
                backgroundColor: inputBg,
                borderColor: inputBorder,
              }]}>
                <MaterialIcons 
                  name="email" 
                  size={20} 
                  color={placeholderColor} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  placeholder="Email Address"
                  placeholderTextColor={placeholderColor}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={[styles.inputContainer, { 
                backgroundColor: inputBg,
                borderColor: inputBorder,
              }]}>
                <MaterialIcons 
                  name="lock" 
                  size={20} 
                  color={placeholderColor} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, { color: textPrimary }]}
                  placeholder="Password"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)} 
                  style={styles.passwordToggle}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility' : 'visibility-off'} 
                    size={22} 
                    color={placeholderColor} 
                  />
                </TouchableOpacity>
              </View>

              <Link href="/forgot-password" asChild>
                <TouchableOpacity style={styles.forgotPasswordButton}>
                  <ThemedText style={[styles.forgotPasswordText, { color: primaryColor }]}>
                    Forgot Password?
                  </ThemedText>
                </TouchableOpacity>
              </Link>

              <TouchableOpacity 
                style={styles.primaryButton} 
                activeOpacity={0.85} 
                onPress={handleLogin}
              >
                <LinearGradient
                  colors={[primaryColor, secondaryColor]}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <ThemedText style={styles.primaryButtonText}>Login</ThemedText>
                <MaterialIcons 
                  name="arrow-forward" 
                  size={20} 
                  color="white" 
                  style={styles.buttonIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: inputBorder }]} />
              <ThemedText style={[styles.dividerText, { color: textSecondary }]}>
                or continue with
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: inputBorder }]} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.socialButton, 
                  { backgroundColor: inputBg, borderColor: inputBorder }
                ]}
                activeOpacity={0.8}
              >
                {/* Using FontAwesome for Google icon */}
                <FontAwesome name="google" size={22} color="#DB4437" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.socialButton, 
                  { backgroundColor: inputBg, borderColor: inputBorder }
                ]}
                activeOpacity={0.8}
              >
                {/* Using FontAwesome for Facebook icon */}
                <FontAwesome name="facebook" size={22} color="#4267B2" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signupContainer}>
            <ThemedText style={[styles.signupText, { color: textSecondary }]}>
              Don't have an account?
            </ThemedText>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <ThemedText style={[styles.signupLink, { color: primaryColor }]}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0, // Stays within ScrollView bounds
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24, // Slightly increased padding
    paddingVertical: 30,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 35, // Adjusted spacing
  },
  heroTitle: {
    fontSize: 32, // Slightly adjusted
    fontWeight: 'bold', // Using 'bold' (often 700)
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16, // Slightly adjusted
    textAlign: 'center',
    maxWidth: '85%', // Constrain width
    lineHeight: 22, // Improved readability
  },
  loginCard: {
    borderRadius: 20, // Slightly softer corners
    paddingHorizontal: 35,
    paddingVertical: 30, // Balanced padding
    // Shadow applied dynamically based on theme
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1, // Softer shadow
    shadowRadius: 16,
    elevation: 8, // Android shadow
  },
  formContent: {
    // No specific styles needed, children handle spacing
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12, // Softer corners
    borderWidth: 1, // Keep border for definition
    paddingHorizontal: 16, // Adjusted padding
    paddingVertical: Platform.OS === 'ios' ? 14 : 12, // Platform-specific padding for input height
    marginBottom: 18, // Adjusted spacing
  },
  inputIcon: {
    marginRight: 10, // Reduced margin
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    // Removed fixed height, padding on container will define it
    // On Android, TextInput might need fine-tuning for vertical alignment if text isn't centered
    textAlignVertical: 'center', // Helps with Android text centering
  },
  passwordToggle: {
    padding: 4, // Slightly larger touch area for the icon
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 25, // Adjusted spacing
    paddingVertical: 4, // Add some touch area
  },
  forgotPasswordText: {
    fontWeight: '600',
    fontSize: 14, // Slightly smaller
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15, // Adjusted padding
    borderRadius: 12, // Matched input fields
    overflow: 'hidden',
    marginBottom: 30, // More space before social
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 17, // Slightly adjusted
    fontWeight: '600', // Bold but not too heavy
    marginRight: 8,
  },
  buttonIcon: {
    // style for icon if needed, e.g. marginLeft
  },
  socialSection: {
    marginVertical: 25, // Adjusted spacing
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Adjusted spacing
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12, // Adjusted padding
    fontSize: 13, // Slightly smaller
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16, // Adjusted gap
  },
  socialButton: {
    width: 54, // Resized
    height: 54, // Resized
    borderRadius: 12, // Softer corners, matched to inputs/button
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Add subtle border
    // Shadow for social buttons (optional, can be subtle)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6, // Adjusted gap
    marginTop: 20, // Adjusted spacing
    paddingBottom: Platform.OS === 'ios' ? 0 : 10, // Ensure it's not cut off on Android due to KAV
  },
  signupText: {
    fontSize: 15, // Slightly adjusted
  },
  signupLink: {
    fontSize: 15, // Matched
    fontWeight: 'bold', // Make link stand out
  },
});