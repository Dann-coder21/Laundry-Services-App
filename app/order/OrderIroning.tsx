import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

// Define types for consistency
type MCIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface IroningItem {
  id: string;
  name: string;
  price: number;
  icon: MCIconName;
  quantity: number; // Will be added dynamically
}

// --- Dummy Data for Ironing Items ---
const ironingItemsData: IroningItem[] = [
  { id: 'shirt', name: 'Shirt', price: 5.00, icon: 'tshirt-crew' },
  { id: 'trousers', name: 'Trousers/Pants', price: 7.00, icon: 'pants-outline' },
  { id: 'dress', name: 'Dress', price: 12.00, icon: 'hanger' },
  { id: 'skirt', name: 'Skirt', price: 6.00, icon: 'human-female-skirt' },
  { id: 'sari', name: 'Sari', price: 15.00, icon: 'human-female-dance' }, // Example for cultural wear
  { id: 'bedsheet', name: 'Bedsheet', price: 10.00, icon: 'bed-empty' },
  { id: 'curtain', name: 'Curtain (Small)', price: 8.00, icon: 'curtains' },
  { id: 'duvet', name: 'Duvet Cover', price: 18.00, icon: 'bed-king' },
  // Add more items as needed
];
// --- End Dummy Data ---

export default function OrderIroning() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const primaryColor = Colors.light.tint; // Assuming Colors.light.tint is your primary purple for the app

  // State for items and instructions
  const [items, setItems] = useState<IroningItem[]>(
    ironingItemsData.map(item => ({ ...item, quantity: 0 }))
  );
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate total estimated cost
  const totalEstimatedCost = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Animation for the bottom button
  const buttonScale = new Animated.Value(1);
  const animatePressIn = () => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  const animatePressOut = () => Animated.spring(buttonScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  // Handle quantity changes for individual items
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  // Function to format currency
  const formatToKsh = (amount: number): string => {
    return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // --- Header Height Calculation (Consistent with OrderDryclean) ---
  // ADJUST THESE VALUES TO CONTROL THE "EXTRA" HEIGHT AFTER THE SAFE AREA
  const HEADER_FIXED_TOP_SPACING = Platform.OS === 'ios' ? 6 : 10; // Extra space *after* insets.top
  const HEADER_INTERNAL_BOTTOM_PADDING = 18;
  const HEADER_CONTENT_HEIGHT_ESTIMATE = 42; // Based on button heights in header

  // This calculates the TOTAL rendered height of the custom header component.
  // It's the sum of the top safe area, the fixed extra spacing, the content in the header, and the bottom padding.
  const DYNAMIC_HEADER_TOTAL_HEIGHT = insets.top + HEADER_FIXED_TOP_SPACING + HEADER_CONTENT_HEIGHT_ESTIMATE + HEADER_INTERNAL_BOTTOM_PADDING;
  // --- End Header Calculation ---

  // --- Data for Cart Navigation (Mocking pick-up/delivery details for demo) ---
  const mockPickupDate = new Date();
  const mockPickupTime = new Date();
  const mockDeliveryAddress = { name: 'Home', details: '123 Main St, Nairobi, Kenya' };
  // --- End Mock Data ---


  const handleAddToOrder = () => {
    const selectedItems = items.filter(item => item.quantity > 0);
    if (selectedItems.length === 0) {
      alert('Please add at least one item to your order.');
      return;
    }

    // Navigate to CartScreen, passing data
    router.push({
      pathname: '/order/cart',
      params: {
        cartItems: JSON.stringify(selectedItems),
        specialInstructions: specialInstructions,
        totalEstimatedCost: totalEstimatedCost.toFixed(2),
        pickupDate: mockPickupDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        pickupTime: mockPickupTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        deliveryAddressDetails: mockDeliveryAddress.details,
      }
    });
  };


  return (
    <ThemedView style={styles.fullContainer}>
      {/* Custom Header */}
      <Stack.Screen
        options={{
          header: () => (
            <BlurView
              intensity={90}
              tint="light"
              // Dynamic paddingTop: insets.top + HEADER_FIXED_TOP_SPACING
              style={[styles.glassHeader, { paddingTop: insets.top + HEADER_FIXED_TOP_SPACING }]}
            >
              {/* Decorative circles */}
              <View style={[styles.glassCircle, styles.glassCircleTop]} />
              <View style={[styles.glassCircle, styles.glassCircleBottom]} />

              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.headerButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#5E35B1" />
              </TouchableOpacity>

              {/* Title with Icon */}
              <View style={styles.headerTitleContainer}>
                <MaterialCommunityIcons
                  name="iron-outline" // Ironing icon
                  size={24}
                  color="#5E35B1"
                  style={styles.headerTitleIcon}
                />
                <Text style={styles.headerTitle}>Order Ironing</Text>
              </View>

              {/* Cart Button */}
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleAddToOrder} // Navigates to cart
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="cart-outline" size={24} color="#5E35B1" />
                {items.some(item => item.quantity > 0) && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </BlurView>
          ),
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: DYNAMIC_HEADER_TOTAL_HEIGHT + 20, paddingBottom: 160 + insets.bottom } // Dynamic padding
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconBackground}>
            <MaterialCommunityIcons name="iron-outline" size={60} color={primaryColor} />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>Ironing Service</ThemedText>
          <ThemedText style={styles.heroTagline}>Professional pressing for a wrinkle-free finish.</ThemedText>
        </View>

        {/* Item Selection Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Select Items for Ironing</ThemedText>
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.garmentItem}>
                <View style={styles.garmentInfo}>
                  <MaterialCommunityIcons name={item.icon} size={28} color={primaryColor} style={styles.garmentIcon} />
                  <View>
                    <ThemedText style={styles.garmentName}>{item.name}</ThemedText>
                    <ThemedText style={styles.itemPrice}>{formatToKsh(item.price)} / item</ThemedText>
                  </View>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={[styles.quantityButton, {backgroundColor: primaryColor}, item.quantity === 0 && styles.quantityButtonDisabled]}
                    onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity === 0}
                  >
                    <MaterialCommunityIcons name="minus" size={20} color={item.quantity === 0 ? '#bbb' : 'white'} />
                  </TouchableOpacity>
                  <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                  <TouchableOpacity
                    style={[styles.quantityButton, {backgroundColor: primaryColor}]}
                    onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            scrollEnabled={false} // Let the parent ScrollView handle overall scrolling
          />
          <View style={styles.totalSummary}>
            <ThemedText style={styles.totalSummaryLabel}>Estimated Total Items:</ThemedText>
            <ThemedText style={styles.totalSummaryValue}>
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </ThemedText>
          </View>
          <View style={styles.totalSummary}>
            <ThemedText style={styles.totalSummaryLabel}>Estimated Cost:</ThemedText>
            <ThemedText style={styles.totalSummaryValue}>
              {formatToKsh(totalEstimatedCost)}
            </ThemedText>
          </View>
        </View>

        {/* Special Instructions Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Special Instructions</ThemedText>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <MaterialIcons name="sticky-note-2" size={20} color="#888" style={styles.inputIcon} />
            <View style={styles.inputField}>
              <TextInput
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                style={styles.textAreaValue}
                multiline={true}
                numberOfLines={4}
                placeholder="e.g., Use low heat, fold neatly, starch preference..."
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>

        {/* Optional: Pickup & Delivery Details Section (similar to OrderDryclean) */}
        {/* You can uncomment and adapt this section if you want to include these details here */}
        {/*
        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Pickup & Delivery Details</Text>
          <TouchableOpacity style={styles.detailRow} onPress={() => {/* open date picker }}>
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}>
              <MaterialCommunityIcons name="calendar" size={20} color={primaryColor} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Date</Text>
              <Text style={styles.detailValue}>{mockPickupDate.toLocaleDateString()}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={() => {/* open time picker }}>
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}>
              <MaterialCommunityIcons name="clock" size={20} color={primaryColor} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Time</Text>
              <Text style={styles.detailValue}>{mockPickupTime.toLocaleTimeString()}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={() => {/* open address picker }}>
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}>
              <MaterialCommunityIcons name="map-marker" size={20} color={primaryColor} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Address</Text>
              <Text style={styles.addressText}>{mockDeliveryAddress.details}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>
        */}
      </ScrollView>

      {/* Sticky Bottom Button */}
      {items.some(item => item.quantity > 0) && ( // Only show button if items are selected
        <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + 15 }]}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.addToOrderButton}
              activeOpacity={0.8}
              onPressIn={animatePressIn}
              onPressOut={animatePressOut}
              onPress={handleAddToOrder}
            >
              <Text style={styles.addToOrderButtonText}>Add to Order {formatToKsh(totalEstimatedCost)}</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="white" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </Animated.View>
        </View>
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
    // paddingTop and paddingBottom set dynamically inline
  },
  // --- Header Styles (consistent with OrderDryclean & DryCleanScreen) ---
  glassHeader: {
    // paddingTop will be set dynamically inline: insets.top + HEADER_FIXED_TOP_SPACING
    paddingBottom: 18,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(245, 243, 255, 0.75)',
    overflow: 'hidden',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94, 53, 177, 0.1)',
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
    backgroundColor: 'rgba(148, 108, 230, 0.12)',
  },
  glassCircleBottom: {
    bottom: -40,
    right: -30,
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(94, 53, 177, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.08)',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
  },
  headerTitleIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2D1155',
  },
  cartBadge: { // Consistent with OrderDryclean's cart badge
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4081',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // --- Hero Section (consistent with DryCleanScreen and OrderDryclean) ---
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  heroIconBackground: {
    backgroundColor: '#EDE7F6', // Lighter purple for ironing
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  heroTitle: {
    marginTop: 0,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  heroTagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    maxWidth: '85%',
    lineHeight: 22,
  },
  // --- General Section Card Styles (consistent) ---
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
  sectionSubtitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },

  // --- Garment Item & Quantity Control (similar to OrderDryclean) ---
  garmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  garmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  garmentIcon: {
    marginRight: 15,
  },
  garmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemPrice: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  quantityButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  totalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalSummaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  totalSummaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#5E35B1",
  },
  // --- Special Instructions Input (consistent) ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: {
    marginRight: 12,
    marginTop: Platform.OS === 'ios' ? 0 : 4,
  },
  inputField: {
    flex: 1,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
  textAreaValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlignVertical: 'top',
    lineHeight: 22,
    padding: 0,
    margin: 0,
  },
  // --- Sticky Bottom Button (consistent) ---
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  addToOrderButton: { // Renamed from orderButton/placeOrderButton
    backgroundColor: '#5E35B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  addToOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});