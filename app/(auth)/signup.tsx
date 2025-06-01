// File: app/(auth)/signup.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter, Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AuthLayout from '@/components/AuthLayout';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SignUpPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // --- Color Palette ---
  // Using Colors.tint for primary and deriving a secondary for gradient
  const appPrimaryColor = Colors[colorScheme ?? 'light'].tint; 
  const appSecondaryColor = isDarkMode ? '#5E35B1' : '#6A1B9A'; // Darker shade for gradient end

  const cardBgColor = isDarkMode ? 'rgba(30, 30, 45, 0.75)' : 'rgba(255, 255, 255, 0.7)'; // Card background for blur
  const inputBgColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(245, 245, 250, 0.9)';
  const inputBorderColor = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
  const inputTextColor = isDarkMode ? Colors.dark.text : Colors.light.text;
  const placeholderTextColor = isDarkMode ? '#9090A0' : '#777'; // Slightly adjusted
  const iconColor = isDarkMode ? '#B0B0C0' : '#666'; // Slightly adjusted
  const dividerLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const socialButtonTextColor = isDarkMode ? Colors.dark.text : Colors.light.text; // Renamed for clarity
  const formHeaderSubtitleColor = isDarkMode ? '#B0B0C0' : '#555';


  // --- State ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all fields to create your account.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
    }
    if (formData.password.length < 6) {
        Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords you entered do not match.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      Alert.alert('Account Created!', 'Welcome aboard! You can now log in.'); // Success feedback
      router.replace('/login'); // Redirect to login after successful signup
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert('Signup Failed', 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX ---
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AuthLayout
        headerTitle="Create Your Account" // Slightly more engaging title
        headerSubtitle="Join our community for a seamless laundry experience"
      >
        <View style={styles.signupCard}>
          {/* Glassmorphism Background */}
          <BlurView
            intensity={Platform.OS === 'ios' ? 30 : 60} // Adjusted intensity
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject} // Covers the entire card
          >
            {/* Subtle gradient inside the blur for depth */}
            <LinearGradient
              colors={isDarkMode
                ? [cardBgColor, 'rgba(20, 20, 35, 0.65)'] // Darker, subtle gradient
                : [cardBgColor, 'rgba(250, 250, 255, 0.6)']} // Lighter, subtle gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </BlurView>

          <View style={styles.formContent}>
            {/* Form Header */}
            <ThemedText style={styles.formHeaderTitle}>Get Started</ThemedText>
            <ThemedText style={[styles.formHeaderSubtitle, { color: formHeaderSubtitleColor }]}>
              Enter your details below to sign up.
            </ThemedText>

            {/* Full Name Input */}
            <View style={[styles.inputContainer, { backgroundColor: inputBgColor, borderColor: inputBorderColor }]}>
              <MaterialIcons name="person-outline" size={20} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="Full Name"
                placeholderTextColor={placeholderTextColor}
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                autoCapitalize="words"
                textContentType="name"
              />
            </View>

            {/* Email Input */}
            <View style={[styles.inputContainer, { backgroundColor: inputBgColor, borderColor: inputBorderColor }]}>
              <MaterialIcons name="mail-outline" size={20} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="Email Address"
                placeholderTextColor={placeholderTextColor}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                textContentType="emailAddress"
              />
            </View>

            {/* Password Input */}
            <View style={[styles.inputContainer, { backgroundColor: inputBgColor, borderColor: inputBorderColor }]}>
              <MaterialIcons name="lock-outline" size={20} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="Password"
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                textContentType="newPassword" // Helps with password managers
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={iconColor} />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={[styles.inputContainer, { backgroundColor: inputBgColor, borderColor: inputBorderColor }]}>
              <MaterialIcons name="lock-outline" size={20} color={iconColor} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: inputTextColor }]}
                placeholder="Confirm Password"
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={!showConfirmPassword}
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                textContentType="newPassword"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.passwordToggle}>
                <MaterialIcons name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={20} color={iconColor} />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.disabledButton]} 
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.85} // Slightly higher for gradient buttons
            >
              <LinearGradient
                colors={[appPrimaryColor, appSecondaryColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              {isLoading ? (
                <ActivityIndicator color="white" size="small" /> 
              ) : (
                <>
                  <ThemedText style={styles.primaryButtonText}>Create Account</ThemedText>
                  <MaterialIcons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
                </>
              )}
            </TouchableOpacity>

            {/* Social Login Divider */}
            <View style={styles.socialDivider}>
              <View style={[styles.dividerLine, { backgroundColor: dividerLineColor }]} />
              <ThemedText style={[styles.dividerText, {color: formHeaderSubtitleColor}]}>or sign up with</ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: dividerLineColor }]} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: inputBgColor, borderColor: inputBorderColor }]} 
                activeOpacity={0.8}
              >
                <Image source={require('@/assets/images/google-logo.png')} style={styles.socialLogo} />
                <ThemedText style={[styles.socialButtonText, { color: socialButtonTextColor }]}>Google</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, { backgroundColor: inputBgColor, borderColor: inputBorderColor }]} 
                activeOpacity={0.8}
              >
                <Image source={require('@/assets/images/facebook-logo.png')} style={styles.socialLogo} />
                <ThemedText style={[styles.socialButtonText, { color: socialButtonTextColor }]}>Facebook</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Footer Link to Login */}
            <View style={styles.footer}>
              <ThemedText style={[styles.footerText, {color: formHeaderSubtitleColor}]}>Already have an account? </ThemedText>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <ThemedText style={[styles.footerLink, { color: appPrimaryColor }]}>
                    Log In
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </AuthLayout>
    </>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  signupCard: {
    marginHorizontal: 20, // Slightly reduced for a bit more edge space if AuthLayout has padding
    borderRadius: 24, // Consistent, slightly softer radius
    overflow: 'hidden', // Essential for BlurView and LinearGradient children
    shadowColor: '#000', // Universal shadow color
    shadowOffset: { width: 0, height: 8 }, // Softer shadow
    shadowOpacity: 0.12, // Softer shadow
    shadowRadius: 20, // Softer shadow
    elevation: 12, // Android shadow
    marginTop: 10, // Add some space if AuthLayout header is close
    marginBottom: 20, // Space at the bottom
  },
  formContent: {
    paddingHorizontal: 24, // Balanced padding
    paddingVertical: 30, // Balanced padding
    backgroundColor: 'transparent', // Must be transparent for BlurView to show through
    position: 'relative', // Ensure content is above BlurView
    zIndex: 1,
  },
  formHeaderTitle: {
    fontSize: 26, // Slightly adjusted
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  formHeaderSubtitle: {
    fontSize: 14, // Slightly adjusted
    marginBottom: 30, // Good spacing before form
    textAlign: 'center',
    lineHeight: 20, // Improved readability
    paddingHorizontal: 10, // Keep text from hitting edges
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12, // Softer radius
    paddingHorizontal: 16, // Adjusted padding
    paddingVertical: Platform.OS === 'ios' ? 15 : 13, // Platform-specific padding
    marginBottom: 18, // Consistent spacing
    borderWidth: 1, // Keep border for definition
  },
  inputIcon: {
    marginRight: 12, // Slightly less margin
  },
  input: {
    flex: 1,
    fontSize: 16, // Standard input text size
    paddingVertical: 0, // Remove default padding if any
  },
  passwordToggle: {
    padding: 4, // Increase touchable area
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16, // Adjusted padding
    borderRadius: 12, // Matched input fields
    overflow: 'hidden', // For LinearGradient
    shadowColor: Colors.light.tint, // Use appPrimaryColor for shadow if dynamic
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 30, // Good spacing before social divider
  },
  disabledButton: {
    opacity: 0.65, // Standard disabled opacity
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 17, // Slightly adjusted
    fontWeight: '600', // Bold but not overly so
    marginRight: 8, // Space before icon
  },
  buttonIcon: {
    // marginLeft: 5, // Already handled by marginRight on text
  },
  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, // Adjusted spacing
  },
  dividerLine: {
    flex: 1,
    height: 1, // Using 1 instead of HairlineWidth for more visibility
  },
  dividerText: {
    marginHorizontal: 12, // Adjusted padding
    fontSize: 13, // Slightly smaller
    fontWeight: '500',
    opacity: 0.8,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space
    gap: 12, // Spacing between buttons
    marginBottom: 30, // Good spacing before footer
  },
  socialButton: {
    flex: 1, // Allow buttons to take equal width
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12, // Matched other elements
    paddingVertical: 14, // Adjusted padding
    paddingHorizontal: 10, // Adjust if text is too long
    borderWidth: 1, // Keep border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  socialLogo: {
    width: 20, // Slightly smaller
    height: 20, // Slightly smaller
    marginRight: 10, // Adjusted spacing
  },
  socialButtonText: {
    fontSize: 14, // Slightly smaller for better fit
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', // Vertically align text
    marginTop: 10, // Reduced top margin as marginBottom from social buttons is larger
    paddingBottom: 10, // Ensure it's not cut off
  },
  footerText: {
    fontSize: 14, // Consistent
    opacity: 0.9,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4, // Small space before link
  },
});