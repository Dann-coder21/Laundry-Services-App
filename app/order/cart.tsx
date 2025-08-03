import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const primaryColor = '#5E35B1'; // Using a consistent purple for the cart page

  const { 
    cartItems, 
    subtotal, 
    deliveryFee, 
    tax, 
    total,
    updateItemQuantity
  } = useCart();

  // --- 1. Use the standard header height for consistency ---
  const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

  const formatToKsh = (amount: number): string => {
    return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const headerComponent = useMemo(() => (
    // --- 2. Update the header JSX to the consistent three-part layout ---
    <BlurView
      intensity={90}
      tint="light"
      style={[styles.glassHeader, { height: HEADER_HEIGHT }]}
    >
      <View style={[styles.glassCircle, styles.glassCircleTop]} />
      <View style={[styles.glassCircle, styles.glassCircleBottom]} />

      {/* Left Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.glassBackButton}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color={primaryColor} />
      </TouchableOpacity>
      
      {/* Centered Title */}
      <View style={styles.glassTitleContainer}>
        <View style={[styles.serviceIconPreview, { backgroundColor: primaryColor }]}>
            <MaterialCommunityIcons name="cart" size={20} color="white" />
        </View>
        <Text style={styles.glassHeaderTitle}>Your Order</Text>
      </View>
      
      {/* Right Spacer for Balance */}
      <View style={styles.headerSpacer} />
    </BlurView>
  ), [insets.top, primaryColor, router]);

  const handleProceedToCheckout = () => {
    router.push('/order/order-summary');
  };

  return (
    <ThemedView style={styles.fullContainer}>
      <Stack.Screen 
        options={{ 
          header: () => headerComponent, 
          headerTransparent: true, 
          headerShadowVisible: false // Ensure no bottom border line
        }} 
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          // --- 3. Use the standard HEADER_HEIGHT for correct content padding ---
          { paddingTop: HEADER_HEIGHT + 20, paddingBottom: 160 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <MaterialCommunityIcons name="cart-remove" size={60} color="#ccc" />
            <ThemedText style={styles.emptyCartText}>Your cart is empty</ThemedText>
            <TouchableOpacity style={styles.continueShoppingButton} onPress={() => router.push('/order/select-service')}>
              <Text style={styles.continueShoppingText}>Add a Service</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.sectionCard}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Review Your Items</ThemedText>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => `${item.serviceType}-${item.id}`}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View style={styles.cartItem}>
                    <View style={styles.itemInfo}>
                      <MaterialCommunityIcons name={item.icon} size={28} color={primaryColor} style={styles.itemIcon} />
                      <View>
                        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                        <ThemedText style={styles.itemPrice}>{formatToKsh(item.price)} each</ThemedText>
                      </View>
                    </View>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity 
                        style={[styles.quantityButton, { backgroundColor: primaryColor }]} 
                        onPress={() => updateItemQuantity(item.id, item.serviceType, item.quantity - 1)}
                      >
                        <MaterialCommunityIcons name="minus" size={20} color={'white'} />
                      </TouchableOpacity>
                      <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                      <TouchableOpacity 
                        style={[styles.quantityButton, { backgroundColor: primaryColor }]} 
                        onPress={() => updateItemQuantity(item.id, item.serviceType, item.quantity + 1)}
                      >
                        <MaterialCommunityIcons name="plus" size={20} color={'white'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.sectionCard}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Order Summary</ThemedText>
              <View style={styles.summaryRow}><ThemedText style={styles.summaryLabel}>Subtotal</ThemedText><ThemedText style={styles.summaryValue}>{formatToKsh(subtotal)}</ThemedText></View>
              <View style={styles.summaryRow}><ThemedText style={styles.summaryLabel}>Delivery Fee</ThemedText><ThemedText style={styles.summaryValue}>{formatToKsh(deliveryFee)}</ThemedText></View>
              <View style={styles.summaryRow}><ThemedText style={styles.summaryLabel}>Tax (16%)</ThemedText><ThemedText style={styles.summaryValue}>{formatToKsh(tax)}</ThemedText></View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}><ThemedText style={styles.totalLabel}>Total</ThemedText><ThemedText style={styles.totalValue}>{formatToKsh(total)}</ThemedText></View>
            </View>
          </>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={[styles.checkoutButtonContainer, { paddingBottom: insets.bottom + 15 }]}>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleProceedToCheckout}>
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Text style={styles.checkoutTotalText}>{formatToKsh(total)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

// --- 4. Update styles to match the consistent header design ---
const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollViewContent: { paddingHorizontal: 20 },
  sectionCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  sectionTitle: { fontSize: 19, fontWeight: '700', marginBottom: 15, color: '#333' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  itemIcon: { marginRight: 15 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333', flexShrink: 1 },
  itemPrice: { fontSize: 13, color: '#777', marginTop: 2 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, backgroundColor: '#F5F5F5', borderRadius: 20 },
  quantityButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontSize: 16, fontWeight: '600', marginHorizontal: 10, minWidth: 20, textAlign: 'center', color: '#333' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: '#555' },
  summaryValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#333' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#5E35B1' },
  glassHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 18,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(245, 243, 255, 0.75)',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94, 53, 177, 0.1)',
  },
  glassCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(94, 53, 177, 0.1)' },
  glassCircleTop: { top: -30, left: -20 },
  glassCircleBottom: { bottom: -40, right: -30 },
  glassBackButton: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1,
    backgroundColor: 'rgba(94, 53, 177, 0.12)',
    borderColor: 'rgba(94, 53, 177, 0.08)'
  },
  glassTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  serviceIconPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  glassHeaderTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2D1155',
  },
  headerSpacer: {
    width: 42,
  },
  emptyCartContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyCartText: { fontSize: 18, color: '#888', marginTop: 20, marginBottom: 30 },
  continueShoppingButton: { backgroundColor: '#5E35B1', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30 },
  continueShoppingText: { color: 'white', fontWeight: '600', fontSize: 16 },
  checkoutButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 15, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eee' },
  checkoutButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 30, backgroundColor: '#5E35B1', shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  checkoutButtonText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  checkoutTotalText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
});