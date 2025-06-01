// File: app/order/promo-checkout.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/Colors'; // Import Colors for theme consistency

export default function PromoCheckoutScreen() {
  const router = useRouter();
  const { promoCode = 'LAUNCH30' } = useLocalSearchParams();
  const [selectedService, setSelectedService] = useState('washFold');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState('');
  const colorScheme = 'light'; // Assuming light mode for consistent colors
  const primaryColor = Colors[colorScheme].tint; // Your app's primary purple, e.g., '#5E35B1'

  const services = [
    { id: 'washFold', name: 'Wash & Fold', basePrice: 25 },
    { id: 'dryClean', name: 'Dry Cleaning', basePrice: 40 },
    { id: 'ironing', name: 'Ironing', basePrice: 30 },
    { id: 'premium', name: 'Premium Service', basePrice: 50 }, // Added for more options
  ];

  const calculateDiscount = () => {
    if (promoCode === 'LAUNCH30') return { type: 'percentage', value: 0.3 }; // 30% off
    if (promoCode === 'FRIEND10') return { type: 'fixed', value: 10 }; // $10 off
    return { type: 'none', value: 0 };
  };

  const currentService = services.find(s => s.id === selectedService);
  const { type: discountType, value: discountValue } = calculateDiscount();
  const subtotal = currentService?.basePrice || 0;
  let total = subtotal;
  let actualDiscountAmount = 0;

  if (discountType === 'percentage') {
    actualDiscountAmount = subtotal * discountValue;
    total = subtotal * (1 - discountValue);
  } else if (discountType === 'fixed') {
    actualDiscountAmount = discountValue;
    total = subtotal - discountValue;
  }
  total = Math.max(0, total); // Ensure total doesn't go below zero

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Confirm Order', // More action-oriented title
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            color: Colors[colorScheme].text,
          },
          headerStyle: {
            backgroundColor: Colors[colorScheme].background,
            height: Platform.OS === 'ios' ? 100 : 70, // Consistent header height
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            borderBottomWidth: 0,
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={primaryColor} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Promo Banner */}
        <LinearGradient
          colors={['#7C4DFF', '#5E35B1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoBanner}
        >
          <MaterialCommunityIcons name="tag" size={24} color="white" />
          <ThemedText style={styles.promoText}>
            Promo Applied: {promoCode} ({discountType === 'percentage' ? `${discountValue * 100}% off` : `$${discountValue} off`})
          </ThemedText>
          <MaterialIcons name="check-circle" size={20} color="white" style={{ marginLeft: 'auto' }} />
        </LinearGradient>

        {/* Service Picker */}
        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Select Service</ThemedText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedService}
              onValueChange={setSelectedService}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {services.map(service => (
                <Picker.Item
                  key={service.id}
                  label={`${service.name} - $${service.basePrice.toFixed(2)}`}
                  value={service.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Date & Time Picker */}
        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Pickup Details</ThemedText>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="calendar-month-outline" size={24} color={primaryColor} />
            <ThemedText style={styles.dateText}>
              {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </ThemedText>
            <MaterialIcons name="edit" size={20} color="#888" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Better UX for iOS
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* Address Input */}
        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Delivery Address</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter your full address..."
            placeholderTextColor="#888"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3} // Allows for a taller input field
          />
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <ThemedText type="title" style={styles.summaryTitle}>Order Summary</ThemedText>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Service:</ThemedText>
            <ThemedText style={styles.summaryValue}>{currentService?.name}</ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Subtotal:</ThemedText>
            <ThemedText style={styles.summaryValue}>${subtotal.toFixed(2)}</ThemedText>
          </View>

          {discountType !== 'none' && (
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Discount ({promoCode}):</ThemedText>
              <ThemedText style={styles.discountText}>
                -${actualDiscountAmount.toFixed(2)}
              </ThemedText>
            </View>
          )}

          <View style={styles.divider} />

          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText style={styles.totalText}>Total Amount:</ThemedText>
            <ThemedText style={styles.totalText}>${total.toFixed(2)}</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button (Sticky at Bottom) */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => router.push('/order/order-summary')} // Update this path if needed
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="check-circle-outline" size={22} color="white" style={styles.confirmButtonIcon} />
          <ThemedText style={styles.confirmButtonText}>Confirm Order</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Consistent light background
  },
  scrollView: {
    padding: 20,
    paddingBottom: 120, // Ensure space for the sticky button
  },
  headerBackButton: {
    backgroundColor: '#EDE7F6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18, // Increased padding
    borderRadius: 15, // More rounded corners
    marginBottom: 25, // More space
    shadowColor: '#5E35B1', // Purple shadow for prominence
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  promoText: {
    color: 'white',
    marginLeft: 15, // More space from icon
    fontWeight: '700', // Bolder
    fontSize: 17, // Larger text
  },
  card: {
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden', // Ensures the border radius applies to the picker content
    marginBottom: Platform.OS === 'ios' ? 0 : 10, // Adjust for Android default picker styling
  },
  picker: {
    backgroundColor: 'white',
    height: Platform.OS === 'ios' ? 180 : 50, // Fixed height for iOS picker, standard for Android
  },
  pickerItem: {
    // Only applies to iOS Picker.Item
    fontSize: 16,
    color: '#333',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F4FD', // Light purple background
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEBF8', // Subtle border
  },
  dateText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#5E35B1', // Use primary color
    flex: 1, // Allow text to grow
  },
  input: {
    backgroundColor: '#F7F4FD', // Light purple background
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EFEBF8',
    fontSize: 16,
    color: '#333',
    lineHeight: 24, // For multiline text
    textAlignVertical: 'top', // For Android multiline placeholder alignment
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25, // More padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20, // Larger title
    fontWeight: 'bold',
    marginBottom: 20, // More space
    color: '#333',
    textAlign: 'center', // Center align title
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // More space between rows
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  discountText: {
    color: '#4CAF50', // Green for discount
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    height: 1.5, // Thicker divider
    backgroundColor: '#eee',
    marginVertical: 18, // More vertical space
  },
  totalRow: {
    marginTop: 5,
    borderTopWidth: 0, // No border, as divider handles it
    paddingTop: 0,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 20, // Larger total text
    color: '#333',
  },
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
    paddingBottom: Platform.OS === 'ios' ? 35 : 20, // Adjust for iOS safe area
  },
  confirmButton: {
    backgroundColor: '#5E35B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18, // More vertical padding
    borderRadius: 30, // Pill-shaped button
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  confirmButtonIcon: {
    marginRight: 10, // Icon on the left
  },
});