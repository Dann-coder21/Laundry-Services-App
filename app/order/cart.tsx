import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy data structure for dry clean items
interface DryCleanItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  quantity: number;
}

// Mock data for cart items
const initialCartItems: DryCleanItem[] = [
  { id: 'suit', name: 'Suit (2 pcs)', icon: 'hanger', price: 14.99, quantity: 2 },
  { id: 'shirt', name: 'Shirt', icon: 'tshirt-crew', price: 5.99, quantity: 3 },
  { id: 'trousers', name: 'Trousers/Pants', icon: 'pants', price: 8.99, quantity: 1 },
];

export default function CartPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = 'light';
  const primaryColor = '#2196F3';
  
  // State for cart items
  const [cartItems, setCartItems] = useState<DryCleanItem[]>(initialCartItems);
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const taxRate = 0.16;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;

  // Update item quantity
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setCartItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0) // Remove items with zero quantity
    );
  };

  // Header height calculation
  const HEADER_INTERNAL_BOTTOM_PADDING = 18;
  const HEADER_CONTENT_HEIGHT_ESTIMATE = 42;
  const DYNAMIC_HEADER_TOTAL_HEIGHT = insets.top + HEADER_CONTENT_HEIGHT_ESTIMATE + HEADER_INTERNAL_BOTTOM_PADDING;

  return (
    <ThemedView style={styles.fullContainer}>
      <Stack.Screen
        options={{
          header: () => (
            <BlurView
              intensity={90}
              tint="light"
              style={[styles.glassHeader, { paddingTop: insets.top }]}
            >
              <View style={[styles.glassCircle, styles.glassCircleTop]} />
              <View style={[styles.glassCircle, styles.glassCircleBottom]} />

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.glassBackButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color={primaryColor}
                />
              </TouchableOpacity>

              <View style={styles.glassTitleContainer}>
                <MaterialCommunityIcons
                  name="cart"
                  size={24}
                  color={primaryColor}
                  style={styles.glassTitleIcon}
                />
                <Text style={styles.glassHeaderTitle}>
                  Your Cart
                </Text>
              </View>
            </BlurView>
          ),
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { 
            paddingTop: DYNAMIC_HEADER_TOTAL_HEIGHT + 20,
            paddingBottom: 160 + insets.bottom
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cart Items Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Selected Items
          </ThemedText>
          
          {cartItems.length === 0 ? (
            <View style={styles.emptyCartContainer}>
              <MaterialCommunityIcons 
                name="cart-remove" 
                size={60} 
                color="#ccc" 
              />
              <ThemedText style={styles.emptyCartText}>
                Your cart is empty
              </ThemedText>
              <TouchableOpacity
                style={styles.continueShoppingButton}
                onPress={() => router.back()}
              >
                <Text style={styles.continueShoppingText}>
                  Continue Shopping
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <View style={styles.itemInfo}>
                    <MaterialCommunityIcons 
                      name={item.icon as any} 
                      size={28} 
                      color={primaryColor} 
                      style={styles.itemIcon} 
                    />
                    <View>
                      <ThemedText style={styles.itemName}>
                        {item.name}
                      </ThemedText>
                      <ThemedText style={styles.itemPrice}>
                        ${item.price.toFixed(2)} each
                      </ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={[styles.quantityButton, item.quantity === 1 && styles.quantityButtonDisabled]}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <MaterialCommunityIcons 
                        name="minus" 
                        size={20} 
                        color={item.quantity === 1 ? '#bbb' : primaryColor} 
                      />
                    </TouchableOpacity>
                    
                    <ThemedText style={styles.quantityText}>
                      {item.quantity}
                    </ThemedText>
                    
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <MaterialCommunityIcons 
                        name="plus" 
                        size={20} 
                        color={primaryColor} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <ThemedText style={styles.itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </ThemedText>
                </View>
              )}
            />
          )}
        </View>

        {/* Order Summary Section */}
        {cartItems.length > 0 && (
          <View style={styles.sectionCard}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Order Summary
            </ThemedText>
            
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
              <ThemedText style={styles.summaryValue}>${subtotal.toFixed(2)}</ThemedText>
            </View>
            
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Delivery Fee</ThemedText>
              <ThemedText style={styles.summaryValue}>${deliveryFee.toFixed(2)}</ThemedText>
            </View>
            
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Tax (16%)</ThemedText>
              <ThemedText style={styles.summaryValue}>${tax.toFixed(2)}</ThemedText>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>${total.toFixed(2)}</ThemedText>
            </View>
          </View>
        )}

        {/* Delivery Info Section */}
        {cartItems.length > 0 && (
          <View style={styles.sectionCard}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Delivery Information
            </ThemedText>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={20} 
                color="#666" 
              />
              <ThemedText style={styles.infoText}>
                123 Main Street, Nairobi, Kenya
              </ThemedText>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons 
                name="calendar" 
                size={20} 
                color="#666" 
              />
              <ThemedText style={styles.infoText}>
                Tomorrow, 10:00 AM - 12:00 PM
              </ThemedText>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <LinearGradient
          colors={[primaryColor, '#64B5F6']}
          style={[styles.checkoutButtonContainer, { paddingBottom: insets.bottom + 15 }]}
        >
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push('/order/checkout')}
          >
            <ThemedText style={styles.checkoutButtonText}>
              Proceed to Checkout
            </ThemedText>
            <ThemedText style={styles.checkoutTotalText}>
              ${total.toFixed(2)}
            </ThemedText>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F9F9F9',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 60,
    textAlign: 'right',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#555',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#555',
  },
  glassHeader: {
    paddingBottom: 18,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(232, 244, 253, 0.75)',
    overflow: 'hidden',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(33, 150, 243, 0.1)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  glassCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  glassCircleTop: {
    top: -30,
    left: -20,
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
  },
  glassCircleBottom: {
    bottom: -40,
    right: -30,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
  },
  glassBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.08)',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  glassTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.05)',
  },
  glassTitleIcon: {
    marginRight: 10,
  },
  glassHeaderTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#0D47A1',
  },
  emptyCartContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  continueShoppingText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  checkoutButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});