import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Animated,
  Easing,
  Image
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderService() {
  const router = useRouter();
  const colorScheme = 'light';
  const primaryColor = Colors[colorScheme].tint;
  const buttonScale = new Animated.Value(1);
  const insets = useSafeAreaInsets();

  // Service data
  const [selectedService, setSelectedService] = useState({
    id: '1',
    title: 'Wash & Fold',
    description: 'Regular laundry service',
    iconName: 'washing-machine',
    iconSet: MaterialCommunityIcons,
    color: '#4CAF50',
    gradient: ['#4CAF50', '#8BC34A']
  });

  // Order details
  const [estimatedWeight, setEstimatedWeight] = useState('5 - 10 lbs');
  const [pickupDate, setPickupDate] = useState('Today, Nov 2');
  const [pickupTime, setPickupTime] = useState('9:00 AM - 11:00 AM');
  const [deliveryDate, setDeliveryDate] = useState('Tomorrow, Nov 3');
  const [deliveryTime, setDeliveryTime] = useState('2:00 PM - 4:00 PM');
  const [specialInstructions, setSpecialInstructions] = useState('Please use eco-friendly detergent.');
  const [isDeliverySameAsPickup, setIsDeliverySameAsPickup] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState({
    id: '1',
    name: 'Home',
    details: '123 Main St, Anytown, USA',
    isDefault: true
  });

  // Pricing
  const subtotal = 25.00;
  const deliveryFee = 5.00;
  const discount = 0.00;
  const total = subtotal + deliveryFee - discount;

  // Animation for button press
  const animatePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const ServiceIconComponent = selectedService.iconSet || MaterialCommunityIcons;

  return (
    <ThemedView style={styles.fullContainer}>
      {/* Header with back button and title */}
      <Stack.Screen
        options={{
          title: 'Place New Order',
          headerTitleStyle: { 
            fontWeight: 'bold',
            fontSize: 18,
            color: '#333'
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={primaryColor} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView 
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: 170 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Overview Card with Gradient */}
        <LinearGradient
          colors={selectedService.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.serviceOverviewCard}
        >
          <View style={styles.serviceIconBg}>
            <ServiceIconComponent 
              name={selectedService.iconName} 
              size={40} 
              color="white" 
            />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceTitle}>{selectedService.title}</Text>
            <Text style={styles.serviceDescription}>{selectedService.description}</Text>
          </View>
          <TouchableOpacity 
            style={styles.changeServiceButton}
            onPress={() => router.push('/services')}
          >
            <Text style={styles.changeServiceButtonText}>Change</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* What Are You Sending Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionSubtitle}>What Are You Sending?</Text>
            <TouchableOpacity onPress={() => router.push('/Weight/Weight-guide')}>
              <Text style={styles.helperLink}>Weight Guide</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => router.push('/Weight/weight-selector')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name="weight-kilogram" 
              size={24} 
              color={primaryColor} 
              style={styles.inputIcon} 
            />
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Estimated Weight / Bags</Text>
              <Text style={styles.inputValue}>{estimatedWeight}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          <View style={styles.weightIndicator}>
            <View style={[styles.weightIndicatorBar, { width: '30%' }]} />
          </View>
          <Text style={styles.inputHelperText}>Weight will be confirmed at pickup</Text>
        </View>

        {/* Pickup Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Pickup Details</Text>
          
          {/* Date */}
          <TouchableOpacity 
            style={styles.detailRow}
            onPress={() => router.push('/Delivery/date-picker')}
            activeOpacity={0.7}
          >
            <View style={styles.detailIconContainer}>
              <MaterialIcons name="event" size={20} color={primaryColor} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{pickupDate}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          {/* Time */}
          <TouchableOpacity 
            style={styles.detailRow}
            onPress={() => router.push('/Delivery/time-picker')}
            activeOpacity={0.7}
          >
            <View style={styles.detailIconContainer}>
              <MaterialIcons name="schedule" size={20} color={primaryColor} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time Slot</Text>
              <Text style={styles.detailValue}>{pickupTime}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          
          {/* Address */}
          <TouchableOpacity 
            style={styles.detailRow}
            onPress={() => router.push('/Delivery/address-selector')}
            activeOpacity={0.7}
          >
            <View style={styles.detailIconContainer}>
              <MaterialIcons name="location-on" size={20} color={primaryColor} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <View style={styles.addressBadge}>
                <Text style={styles.addressBadgeText}>{selectedAddress.name}</Text>
                {selectedAddress.isDefault && (
                  <Text style={styles.defaultBadgeText}>Default</Text>
                )}
              </View>
              <Text style={styles.detailValue}>{selectedAddress.details}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Delivery Details Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionSubtitle}>Delivery Details</Text>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsDeliverySameAsPickup(!isDeliverySameAsPickup)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={isDeliverySameAsPickup ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                size={24}
                color={isDeliverySameAsPickup ? primaryColor : '#ccc'}
              />
              <Text style={styles.checkboxText}>Same as pickup</Text>
            </TouchableOpacity>
          </View>

          {!isDeliverySameAsPickup && (
            <>
              {/* Delivery Date */}
              <TouchableOpacity 
                style={styles.detailRow}
                onPress={() => router.push('/Delivery/date-picker')}
                activeOpacity={0.7}
              >
                <View style={styles.detailIconContainer}>
                  <MaterialIcons name="event" size={20} color={primaryColor} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{deliveryDate}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              
              {/* Delivery Time */}
              <TouchableOpacity 
                style={styles.detailRow}
                onPress={() => router.push('/Delivery/time-picker')}
                activeOpacity={0.7}
              >
                <View style={styles.detailIconContainer}>
                  <MaterialIcons name="schedule" size={20} color={primaryColor} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Time Slot</Text>
                  <Text style={styles.detailValue}>{deliveryTime}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              
              {/* Delivery Address */}
              <TouchableOpacity 
                style={styles.detailRow}
                onPress={() => router.push('/Delivery/address-selector')}
                activeOpacity={0.7}
              >
                <View style={styles.detailIconContainer}>
                  <MaterialIcons name="location-on" size={20} color={primaryColor} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.detailValue}>123 Main St, Anytown, USA</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Special Instructions Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Special Instructions</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <MaterialIcons 
              name="sticky-note-2" 
              size={24} 
              color={primaryColor} 
              style={styles.inputIcon} 
            />
            <TextInput
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              style={styles.textAreaValue}
              multiline={true}
              numberOfLines={4}
              placeholder="Any special requests for your order..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Order Summary Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>-${discount.toFixed(2)}</Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          
          <View style={styles.paymentMethod}>
            <FontAwesome name="credit-card" size={20} color="#555" />
            <Text style={styles.paymentMethodText}>VISA •••• 4242</Text>
            <TouchableOpacity onPress={() => router.push('/payment/payment-methods')}>
              <Text style={styles.changePaymentText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Promo Code Section */}
        <View style={styles.sectionCard}>
          <View style={styles.promoCodeContainer}>
            <MaterialCommunityIcons 
              name="ticket-percent" 
              size={24} 
              color={primaryColor} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.promoCodeInput}
              placeholder="Enter promo code"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.applyPromoButton}>
              <Text style={styles.applyPromoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom }]}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.placeOrderButton} 
            activeOpacity={0.8} 
            onPress={() => router.push('/order/order-summary')}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
          >
            <Text style={styles.placeOrderButtonText}>Place Order - ${total.toFixed(2)}</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color="white" 
              style={styles.placeOrderButtonIcon} 
            />
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.securityBadge}>
          <MaterialCommunityIcons name="shield-check" size={16} color="#4CAF50" />
          <Text style={styles.securityText}>Secure Payment</Text>
        </View>
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
    paddingBottom: 150,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(94,53,177,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Service Overview Card
  serviceOverviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  serviceIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  changeServiceButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  changeServiceButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  // Section Styles
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  helperLink: {
    fontSize: 14,
    color: '#5E35B1',
    fontWeight: '500',
  },
  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: {
    marginRight: 12,
  },
  inputField: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  inputHelperText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 15,
  },
  weightIndicator: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginBottom: 10,
    overflow: 'hidden',
  },
  weightIndicatorBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  // Detail Row Styles
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(94,53,177,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  addressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  addressBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginRight: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#5E35B1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  // Checkbox Styles
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#555',
  },
  // Text Area Styles
  textAreaContainer: {
    minHeight: 120,
    alignItems: 'flex-start',
  },
  textAreaValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  // Order Summary Styles
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  discountValue: {
    color: '#4CAF50',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#5E35B1',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    flex: 1,
  },
  changePaymentText: {
    fontSize: 14,
    color: '#5E35B1',
    fontWeight: '500',
  },
  // Promo Code Styles
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  promoCodeInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  applyPromoButton: {
    backgroundColor: '#5E35B1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyPromoButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  // Bottom Button Container
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
  placeOrderButton: {
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
  placeOrderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  placeOrderButtonIcon: {
    marginLeft: 10,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  securityText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: '500',
  },
});