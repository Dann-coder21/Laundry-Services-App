import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  // TextInput // Uncomment this if you actually use TextInput for instructions
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';


// --- Dummy Data for Dry Clean Items ---
const dryCleanItemsData = [
  { id: 'suit', name: 'Suit (2 pcs)', icon: 'hanger', price: 14.99 },
  { id: 'dress', name: 'Dress', icon: 'hanger', price: 10.99 },
  { id: 'shirt', name: 'Shirt', icon: 'tshirt-crew', price: 5.99 },
  { id: 'trousers', name: 'Trousers/Pants', icon: 'pants', price: 8.99 },
  { id: 'jacket', name: 'Jacket', icon: 'jacket', price: 18.99 },
  { id: 'blouse', name: 'Blouse', icon: 'tshirt-crew-outline', price: 6.99 },
  { id: 'skirt', name: 'Skirt', icon: 'human-female-skirt', price: 7.99 },
  { id: 'coat', name: 'Coat (Heavy)', icon: 'coat-rack', price: 24.99 },
  { id: 'tie', name: 'Tie', icon: 'tie', price: 4.99 },
];
// --- End Dummy Data ---

export default function OrderDryclean() {
  const router = useRouter();
  const colorScheme = 'light';
  // Primary color for Dry Clean is blue, as per your HomeScreen service cards
  const primaryColor = '#2196F3';

  // State to manage quantities of each dry clean item
  const [items, setItems] = useState(
    dryCleanItemsData.map(item => ({ ...item, quantity: 0 }))
  );
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate total estimated cost
  const totalEstimatedCost = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // Functions to update item quantities
  const incrementQuantity = (id: string) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id: string) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  // Handle "Add to Order" button press
  const handleAddToOrder = () => {
  const selectedItems = items.filter(item => item.quantity > 0);
  console.log('Dry Clean Order Details:', {
    selectedItems,
    specialInstructions,
    totalEstimatedCost: totalEstimatedCost.toFixed(2),
  });
  // Navigate to order summary
  router.push('/order/order-summary');
};

  return (
    <ThemedView style={styles.fullContainer}>
     <Stack.Screen
  options={{
    header: () => (
      <BlurView
        intensity={90}
        tint="light"
        style={styles.glassHeader}
      >
        {/* Decorative elements */}
        <View style={[styles.glassCircle, styles.glassCircleTop]} />
        <View style={[styles.glassCircle, styles.glassCircleBottom]} />
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.glassBackButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#2196F3" 
          />
        </TouchableOpacity>

        {/* Title with Icon */}
        <View style={styles.glassTitleContainer}>
          <MaterialCommunityIcons 
            name="hanger" 
            size={24} 
            color="#2196F3" 
            style={styles.glassTitleIcon}
          />
          <Text style={styles.glassHeaderTitle}>
            Dry Clean Order
          </Text>
        </View>
        
        {/* Action Button - Cart Preview */}
        <TouchableOpacity
          style={styles.cartPreviewButton}
          onPress={() => router.push('/order/cart')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="cart-outline" 
            size={24} 
            color="#2196F3" 
          />
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
          { paddingBottom: 160 } // Increased padding for sticky button + tab bar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIconBackground, { backgroundColor: `${primaryColor}20` }]}>
            <MaterialCommunityIcons name="hanger" size={60} color={primaryColor} />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>Dry Clean Service</ThemedText>
          <ThemedText style={styles.heroTagline}>Select your garments for expert dry cleaning.</ThemedText>
        </View>

        {/* Garment Selection Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Select Your Garments</ThemedText>
          <View style={styles.garmentsList}>
            {items.map(item => (
              <View key={item.id} style={styles.garmentItem}>
                <View style={styles.garmentInfo}>
                  <MaterialCommunityIcons name={item.icon as any} size={28} color={primaryColor} style={styles.garmentIcon} />
                  <View>
                    <ThemedText style={styles.garmentName}>{item.name}</ThemedText>
                    <ThemedText style={styles.itemPrice}>${item.price.toFixed(2)} / item</ThemedText>
                  </View>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={[styles.quantityButton, item.quantity === 0 && styles.quantityButtonDisabled]}
                    onPress={() => decrementQuantity(item.id)}
                    disabled={item.quantity === 0}
                  >
                    <MaterialCommunityIcons name="minus" size={20} color={item.quantity === 0 ? '#bbb' : 'white'} />
                  </TouchableOpacity>
                  <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => incrementQuantity(item.id)}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.totalSummary}>
            <ThemedText style={styles.totalSummaryLabel}>Estimated Total Items:</ThemedText>
            <ThemedText style={styles.totalSummaryValue}>
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </ThemedText>
          </View>
          <View style={styles.totalSummary}>
            <ThemedText style={styles.totalSummaryLabel}>Estimated Cost:</ThemedText>
            <ThemedText style={styles.totalSummaryValue}>
              ${totalEstimatedCost.toFixed(2)}
            </ThemedText>
          </View>
        </View>

        {/* Special Instructions Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Special Instructions</ThemedText>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <MaterialIcons name="sticky-note-2" size={20} color="#888" style={styles.inputIcon} />
            <View style={styles.inputField}>
              {/* Replace with <TextInput value={specialInstructions} onChangeText={setSpecialInstructions} style={styles.textAreaValue} multiline={true} numberOfLines={4} placeholder="e.g., specific stains, repair needs, delicate handling..." /> */}
              <ThemedText style={styles.textAreaValue}>
                {specialInstructions || 'e.g., specific stains, repair needs, delicate handling...'}
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Button at the bottom */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.orderButton, { backgroundColor: primaryColor, shadowColor: primaryColor }]}
          activeOpacity={0.8}
          onPress={handleAddToOrder}
        >
          <ThemedText style={styles.orderButtonText}>Add to Order</ThemedText>
          <MaterialCommunityIcons name="arrow-right" size={20} color="white" style={styles.orderButtonIcon} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    paddingBottom: 160, // <-- Increased from 100 to 160
    paddingHorizontal: 20,
  },
  backButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(94,53,177,0.1)', // Can use the main app theme color here
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- Hero Section Styles (Consistent with other service pages) ---
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  heroIconBackground: {
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
  // --- General Section Card Styles (Consistent) ---
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

  // --- Garment List & Item Styles (New) ---
  garmentsList: {
    // No specific style needed for the container itself, items will space themselves
  },
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
    flex: 1, // Allows info to take up available space
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
    overflow: 'hidden', // Ensures inner elements respect borderRadius
  },
  quantityButton: {
    backgroundColor: Colors.light.tint, // Primary purple for buttons, but here it's the Dry Clean blue
    width: 36,
    height: 36,
    borderRadius: 18, // Half of width/height for perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2, // Small margin to create separation if needed
    //backgroundColor: "#5E35B1", // Use the specific primary color for the buttons
  },
  quantityButtonDisabled: {
    backgroundColor: '#E0E0E0', // Muted background when disabled
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 30, // Ensure space for 2-3 digit quantities
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
    color: "#5E35B1", // Use the service's primary color
  },

  // --- Special Instructions Input (Consistent) ---
  inputContainer: { // Reused for instructions
    flexDirection: 'row',
    alignItems: 'center', // Aligned to top for textarea
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: { // Reused for instructions
    marginRight: 12,
    marginTop: Platform.OS === 'ios' ? 0 : 4, // Adjust icon alignment for multiline on Android
  },
  inputField: { // Reused for instructions
    flex: 1,
  },
  textAreaContainer: { // Specific for textarea
    height: 120,
    alignItems: 'flex-start',
    paddingVertical: 15,
  },
  textAreaValue: { // Specific for textarea
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlignVertical: 'top', // Align text to top in multiline input
    lineHeight: 22,
  },

  // --- Sticky Bottom Button (Consistent) ---
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
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  orderButton: {
    // backgroundColor set dynamically below
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    // shadowColor set dynamically below
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  orderButtonIcon: {
    marginLeft: 10,
  },
  glassHeader: {
  paddingTop: Platform.OS === 'ios' ? 50 : 30,
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
cartPreviewButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: 'rgba(33, 150, 243, 0.08)',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'rgba(33, 150, 243, 0.05)',
  position: 'relative',
},
cartBadge: {
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
});