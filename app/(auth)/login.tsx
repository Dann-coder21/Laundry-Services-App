import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { Stack, useRouter, Link } from 'expo-router';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// --- Interface for Modern Input Props ---
interface ModernInputProps {
  iconName: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  onTogglePasswordVisibility?: () => void;
  showPassword?: boolean;
  isDarkMode: boolean;
  accentColor: string;
  inputBg: string;
  textPrimary: string;
  placeholderColor: string;
}

// --- Modern Input Component ---
const ModernInput: React.FC<ModernInputProps> = ({
  iconName,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  onTogglePasswordVisibility,
  showPassword,
  isDarkMode,
  accentColor,
  inputBg,
  textPrimary,
  placeholderColor,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnimation, {
        toValue: isFocused ? 1.02 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(borderAnimation, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused]);

  return (
    <Animated.View 
      style={[
        styles.inputContainer,
        {
          transform: [{ scale: scaleAnimation }],
          backgroundColor: inputBg,
          borderColor: borderAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', accentColor],
          }),
          shadowColor: accentColor,
          shadowOpacity: isFocused ? 0.15 : 0,
        }
      ]}
    >
      <View style={styles.inputIconContainer}>
        <Ionicons
          name={iconName}
          size={22}
          color={isFocused ? accentColor : placeholderColor}
        />
      </View>
      
      <TextInput
        style={[styles.input, { color: textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        cursorColor={accentColor}
        selectionColor={`${accentColor}30`}
      />
      
      {onTogglePasswordVisibility && (
        <TouchableOpacity
          onPress={onTogglePasswordVisibility}
          style={styles.passwordToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={22}
            color={isFocused ? accentColor : placeholderColor}
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// --- Main LoginPage Component ---
export default function LoginPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Modern color scheme
  const colors = {
    primary: '#6366F1', // Indigo
    secondary: '#8B5CF6', // Violet
    accent: '#06B6D4', // Cyan
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    background: isDarkMode ? '#0F0F23' : '#FAFAFA',
    surface: isDarkMode ? '#1A1B3E' : '#FFFFFF',
    inputBg: isDarkMode ? '#252759' : '#F8FAFC',
    textPrimary: isDarkMode ? '#FFFFFF' : '#1F2937',
    textSecondary: isDarkMode ? '#9CA3AF' : '#6B7280',
    placeholder: isDarkMode ? '#6B7280' : '#9CA3AF',
    border: isDarkMode ? '#374151' : '#E5E7EB',
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    console.log('Login attempt:', { email, password });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Dynamic Background */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={isDarkMode 
            ? ['#0F0F23', '#1A1B3E', '#252759'] 
            : ['#FAFAFA', '#F0F9FF', '#EFF6FF']
          }
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Floating Elements */}
        <View style={[styles.floatingElement, styles.element1, { backgroundColor: colors.primary + '20' }]} />
        <View style={[styles.floatingElement, styles.element2, { backgroundColor: colors.secondary + '15' }]} />
        <View style={[styles.floatingElement, styles.element3, { backgroundColor: colors.accent + '10' }]} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={[styles.logoContainer, { backgroundColor: colors.primary + '15' }]}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="shield-checkmark" size={32} color="white" />
                </LinearGradient>
              </View>
              
              <ThemedText style={[styles.title, { color: colors.textPrimary }]}>
                Welcome Back
              </ThemedText>
              <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                Sign in to continue your journey
              </ThemedText>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <ModernInput
                iconName="mail-outline"
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                isDarkMode={isDarkMode}
                accentColor={colors.primary}
                inputBg={colors.inputBg}
                textPrimary={colors.textPrimary}
                placeholderColor={colors.placeholder}
              />

              <ModernInput
                iconName="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
                isDarkMode={isDarkMode}
                accentColor={colors.primary}
                inputBg={colors.inputBg}
                textPrimary={colors.textPrimary}
                placeholderColor={colors.placeholder}
              />

              <Link href="/forgot-password" asChild>
                <TouchableOpacity style={styles.forgotPassword}>
                  <ThemedText style={[styles.forgotPasswordText, { color: colors.primary }]}>
                    Forgot password?
                  </ThemedText>
                </TouchableOpacity>
              </Link>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, { opacity: isLoading ? 0.7 : 1 }]}
                activeOpacity={0.9}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.spinner}>
                        <Ionicons name="refresh" size={20} color="white" />
                      </Animated.View>
                      <ThemedText style={styles.buttonText}>Signing in...</ThemedText>
                    </View>
                  ) : (
                    <View style={styles.buttonContent}>
                      <ThemedText style={styles.buttonText}>Sign In</ThemedText>
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <ThemedText style={[styles.dividerText, { color: colors.textSecondary }]}>
                or continue with
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.inputBg }]}
                activeOpacity={0.8}
              >
                <FontAwesome name="google" size={20} color="#DB4437" />
                <ThemedText style={[styles.socialText, { color: colors.textPrimary }]}>Google</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.inputBg }]}
                activeOpacity={0.8}
              >
                <FontAwesome name="apple" size={20} color={isDarkMode ? "white" : "black"} />
                <ThemedText style={[styles.socialText, { color: colors.textPrimary }]}>Apple</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <ThemedText style={[styles.signupText, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </ThemedText>
              <Link href="/signup" asChild>
                <TouchableOpacity>
                  <ThemedText style={[styles.signupLink, { color: colors.primary }]}>
                    Sign up
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    flex: 1,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 100,
  },
  element1: {
    width: 120,
    height: 120,
    top: screenHeight * 0.1,
    right: -20,
  },
  element2: {
    width: 80,
    height: 80,
    top: screenHeight * 0.3,
    left: -30,
  },
  element3: {
    width: 60,
    height: 60,
    bottom: screenHeight * 0.2,
    right: 30,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  passwordToggle: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  spinner: {
    // Add rotation animation if needed
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  socialText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});