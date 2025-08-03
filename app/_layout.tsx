import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors'; // Make sure this import exists

// --- 1. Import the CartProvider you created ---
import { CartProvider } from './context/CartContext';// Adjust this path if your context file is located elsewhere

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* --- 2. Wrap your navigators with the CartProvider --- */}
      {/* This makes the global cart state available to all screens defined below */}
      <CartProvider>
        <Stack screenOptions={{ headerShown: true }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen name="schedule/schedule1" />
          <Stack.Screen name="categories/Wash&Fold" />
          <Stack.Screen name="categories/DryClean" />
          <Stack.Screen name="categories/Ironing" />
          <Stack.Screen name="categories/Premium" />
          <Stack.Screen name="order/OrderService" />
          <Stack.Screen name="order/order-summary" />
          <Stack.Screen name="order/Order-confirmation" />
          <Stack.Screen name="order/OrderDryclean" />
          <Stack.Screen name="order/OrderWashAndFold" />
          <Stack.Screen name="order/OrderIroning" />
          <Stack.Screen name="order/select-service" />
          <Stack.Screen name="order/premium-order" />
          <Stack.Screen name="promo/promo-checkout" />
          <Stack.Screen name="promo/promo-page" />
          <Stack.Screen name="Weight/Weight-guide" />
          <Stack.Screen name="Weight/Weight-selector" />
          <Stack.Screen name="payment/payment-methods" />
          <Stack.Screen name="address/address-selector" />
          <Stack.Screen name="promo" />

          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </CartProvider>
    </ThemeProvider>
  );
}