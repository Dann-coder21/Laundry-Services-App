import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart, CartItem } from '../context/CartContext';

// --- Type Definitions ---
type MCIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ServiceType {
  id: string;
  title: string;
  description: string;
  iconName: MCIconName;
  iconSet: typeof MaterialCommunityIcons;
  color: string;
  gradient: LinearGradientProps['colors'];
}

interface WeightOption {
  label: string;
  value: number;
  price: number;
}

export default function OrderService() {
  const router = useRouter();
  const colorScheme = 'light';
  const primaryColor = Colors[colorScheme].tint;
  const buttonScale = new Animated.Value(1);
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

  // --- Use the Cart Context ---
  const { cartItems, updateServiceItems } = useCart();

  // --- Service Data (could be dynamic in a real app) ---
  const [selectedService, setSelectedService] = useState<ServiceType>({
    id: '1',
    title: 'Wash & Fold',
    description: 'Regular laundry by weight',
    iconName: 'washing-machine',
    iconSet: MaterialCommunityIcons,
    color: '#4CAF50',
    gradient: ['#4CAF50', '#8BC34A'],
  });

  // --- Weight Options ---
  const weightOptions: WeightOption[] = [
    { label: '3 - 6 kgs', value: 7.5, price: 400 },
    { label: '7 - 10 kgs', value: 15, price: 750 },
    { label: '11 - 14 kgs', value: 25, price: 1000 },
    { label: '15 - 18 kgs', value: 35, price: 1250 },
  ];

  // --- Initialize local state from global cart state ("caching") ---
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(() => {
    // Find if a wash & fold item already exists in the cart
    const existingItem = cartItems.find(item => item.serviceType === 'washAndFold');
    if (existingItem) {
      // Find the corresponding weight option based on the price
      const matchingOption = weightOptions.find(option => option.price === existingItem.price);
      if (matchingOption) {
        return matchingOption;
      }
    }
    // Return the default if nothing is found
    return weightOptions[0];
  });

  const [weightModalVisible, setWeightModalVisible] = useState(false);

  // --- Local state for order details (not part of the cart item itself) ---
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'pickup' | 'delivery'>('pickup');
  const [timePickerMode, setTimePickerMode] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryDate, setDeliveryDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [deliveryTime, setDeliveryTime] = useState(new Date());
  const [addressOptions] = useState([
    { id: '1', name: 'Home', details: '123 Main St, Nairobi, Kenya', isDefault: true },
    { id: '2', name: 'Work', details: '456 Business Park, Westlands, Nairobi', isDefault: false },
    { id: '3', name: 'Campus', details: 'University Way, Nairobi', isDefault: false },
  ]);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addressOptions.find(a => a.isDefault) || addressOptions[0]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isDeliverySameAsPickup, setIsDeliverySameAsPickup] = useState(true);

  // --- Local Calculations for UI feedback on this screen ---
  const deliveryFee = 500;
  const discount = 0;
  const subtotal = selectedWeight.price;
  const taxRate = 0.16;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + deliveryFee - discount + tax;

  // --- Event Handlers ---
  const animatePressIn = () => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  const animatePressOut = () => Animated.spring(buttonScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Correctly handle date picker visibility
    setShowDatePicker(false);
    
    if (selectedDate) {
      if (datePickerMode === 'pickup') {
        setPickupDate(selectedDate);
      } else {
        setDeliveryDate(selectedDate);
      }
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    // Correctly handle time picker visibility
    setShowTimePicker(false);

    if (selectedTime) {
      if (timePickerMode === 'pickup') {
        setPickupTime(selectedTime);
      } else {
        setDeliveryTime(selectedTime);
      }
    }
  };

  // --- Create Handler to Update Global Cart ---
  const handlePlaceOrder = () => {
    // A. Create a cart item from the selected weight.
    const washAndFoldItem: Omit<CartItem, 'serviceType'> = {
      id: `wash-fold-${selectedWeight.value}`,
      name: `Wash & Fold (${selectedWeight.label})`,
      price: selectedWeight.price,
      quantity: 1,
      icon: 'washing-machine',
    };

    // B. Update the global cart context.
    updateServiceItems('washAndFold', [washAndFoldItem]);

    // C. Navigate to the summary screen.
    router.push('/order/order-summary');
  };

  // --- Formatting Functions ---
  const formatDate = (date: Date): string => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (date: Date): string => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const ServiceIconComponent = selectedService.iconSet || MaterialCommunityIcons;

  return (
    <ThemedView style={styles.fullContainer}>
      <Stack.Screen
        options={{
          header: () => (
            <BlurView intensity={90} tint="light" style={[styles.glassHeader, { height: HEADER_HEIGHT }]}>
              <View style={[styles.glassCircle, styles.glassCircleTop]} />
              <View style={[styles.glassCircle, styles.glassCircleBottom]} />
              <TouchableOpacity onPress={() => router.back()} style={styles.glassBackButton} activeOpacity={0.8}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={primaryColor} />
              </TouchableOpacity>
              <View style={styles.glassTitleContainer}>
                <View style={[styles.serviceIconPreview, { backgroundColor: (selectedService.gradient ? selectedService.gradient[0] as string : primaryColor) }]}>
                  <MaterialCommunityIcons name={selectedService.iconName} size={20} color="white" />
                </View>
                <Text style={styles.glassHeaderTitle}>Place New Order</Text>
              </View>
              <TouchableOpacity style={styles.serviceChangeButton} onPress={() => router.push('/order/select-service')} activeOpacity={0.8}>
                <MaterialCommunityIcons name="swap-horizontal" size={20} color={primaryColor} />
              </TouchableOpacity>
            </BlurView>
          ),
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
        
      {showDatePicker && (
        <DateTimePicker
          value={datePickerMode === 'pickup' ? pickupDate : deliveryDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={timePickerMode === 'pickup' ? pickupTime : deliveryTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      
      <ScrollView
        contentContainerStyle={[styles.scrollViewContent, { paddingTop: HEADER_HEIGHT + 20, paddingBottom: 170 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={selectedService.gradient || [primaryColor, Colors.light.background]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.serviceOverviewCard}>
          <View style={styles.serviceIconBg}><ServiceIconComponent name={selectedService.iconName} size={40} color="white" /></View>
          <View style={styles.serviceInfo}><Text style={styles.serviceTitle}>{selectedService.title}</Text><Text style={styles.serviceDescription}>{selectedService.description}</Text></View>
          <TouchableOpacity style={styles.changeServiceButton} onPress={() => router.push('/order/select-service')}><Text style={styles.changeServiceButtonText}>Change</Text></TouchableOpacity>
        </LinearGradient>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}><Text style={styles.sectionSubtitle}>What Are You Sending?</Text><TouchableOpacity onPress={() => router.push('/Weight/Weight-guide')}><Text style={styles.helperLink}>Weight Guide</Text></TouchableOpacity></View>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setWeightModalVisible(true)} activeOpacity={0.7}>
            <MaterialCommunityIcons name="weight-kilogram" size={24} color={primaryColor} style={styles.inputIcon} />
            <View style={styles.inputField}><Text style={styles.inputLabel}>Estimated Weight / Bags</Text><Text style={styles.inputValue}>{selectedWeight.label}</Text></View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <Modal visible={weightModalVisible} transparent animationType="slide" onRequestClose={() => setWeightModalVisible(false)}>
            <View style={styles.modalContainer}><View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Estimated Weight</Text>
                {weightOptions.map((option) => (<TouchableOpacity key={option.label} style={[styles.modalOption, selectedWeight.label === option.label && styles.modalOptionSelected]} onPress={() => { setSelectedWeight(option); setWeightModalVisible(false); }}>
                    <Text style={[styles.modalOptionText, selectedWeight.label === option.label && styles.modalOptionTextSelected]}>{option.label} ({formatToKsh(option.price)})</Text></TouchableOpacity>))}
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setWeightModalVisible(false)}><Text style={styles.modalCloseText}>Cancel</Text></TouchableOpacity>
            </View></View>
          </Modal>
          <View style={styles.weightIndicator}><View style={[styles.weightIndicatorBar, { width: `${((selectedWeight.value - 5) / (40 - 5)) * 100}%`}]} /></View>
          <Text style={styles.inputHelperText}>Weight will be confirmed upon collection.</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Pickup Details</Text>
          <TouchableOpacity style={styles.detailRow} onPress={() => { setDatePickerMode('pickup'); setShowDatePicker(true); }}>
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}><MaterialCommunityIcons name="calendar" size={20} color={primaryColor} /></View>
            <View style={styles.detailContent}><Text style={styles.detailLabel}>Pickup Date</Text><Text style={styles.detailValue}>{formatDate(pickupDate)}</Text></View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={() => { setTimePickerMode('pickup'); setShowTimePicker(true); }}>
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}><MaterialCommunityIcons name="clock" size={20} color={primaryColor} /></View>
            <View style={styles.detailContent}><Text style={styles.detailLabel}>Pickup Time</Text><Text style={styles.detailValue}>{formatTime(pickupTime)}</Text></View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={() => setAddressModalVisible(true)}>
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}><MaterialCommunityIcons name="map-marker" size={20} color={primaryColor} /></View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Address</Text>
              <Text style={styles.addressText}>{selectedAddress.details}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Delivery Details</Text>
          <View style={styles.checkboxRow}>
            <TouchableOpacity onPress={() => setIsDeliverySameAsPickup(!isDeliverySameAsPickup)}>
              <MaterialCommunityIcons
                name={isDeliverySameAsPickup ? "checkbox-marked" : "checkbox-blank-outline"}
                size={24}
                color={isDeliverySameAsPickup ? primaryColor : '#ccc'}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxText}>Delivery address and time same as pickup</Text>
          </View>
          {!isDeliverySameAsPickup && (
            <>
              <TouchableOpacity style={styles.detailRow} onPress={() => { setDatePickerMode('delivery'); setShowDatePicker(true); }}>
                <View style={[styles.detailIconContainer, { backgroundColor: '#E0F2F1' }]}><MaterialCommunityIcons name="calendar-check" size={20} color="#009688" /></View>
                <View style={styles.detailContent}><Text style={styles.detailLabel}>Delivery Date</Text><Text style={styles.detailValue}>{formatDate(deliveryDate)}</Text></View>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailRow} onPress={() => { setTimePickerMode('delivery'); setShowTimePicker(true); }}>
                <View style={[styles.detailIconContainer, { backgroundColor: '#E0F2F1' }]}><MaterialCommunityIcons name="clock-outline" size={20} color="#009688" /></View>
                <View style={styles.detailContent}><Text style={styles.detailLabel}>Delivery Time</Text><Text style={styles.detailValue}>{formatTime(deliveryTime)}</Text></View>
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Additional Information</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <MaterialCommunityIcons name="note-text-outline" size={24} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.textAreaValue}
              placeholder="E.g. delicate items, specific fabric care, or special drop-off instructions..."
              placeholderTextColor="#aaa"
              multiline
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatToKsh(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatToKsh(deliveryFee)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>- {formatToKsh(discount)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (16%)</Text>
            <Text style={styles.summaryValue}>{formatToKsh(tax)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatToKsh(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={addressModalVisible} transparent animationType="slide" onRequestClose={() => setAddressModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Address</Text>
            <FlatList
              data={addressOptions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.addressItem, item.id === selectedAddress.id && styles.selectedAddressItem]}
                  onPress={() => {
                    setSelectedAddress(item);
                    setAddressModalVisible(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name={item.id === selectedAddress.id ? "radiobox-marked" : "radiobox-blank"}
                    size={24}
                    color={item.id === selectedAddress.id ? primaryColor : '#ccc'}
                  />
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressName}>{item.name}</Text>
                    <Text style={styles.addressText}>{item.details}</Text>
                    {item.isDefault && <Text style={styles.defaultTag}>Default</Text>}
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.addAddressButton} onPress={() => { /* Handle adding a new address */ }}>
              <MaterialCommunityIcons name="plus-circle" size={24} color={primaryColor} />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setAddressModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + 10 }]}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity 
            style={styles.placeOrderButton} 
            activeOpacity={0.8} 
            onPress={handlePlaceOrder}
            onPressIn={animatePressIn} 
            onPressOut={animatePressOut}
          >
            <Text style={styles.placeOrderButtonText}>Add to Order - {formatToKsh(total)}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="white" style={styles.placeOrderButtonIcon} />
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.securityBadge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#4CAF50" />
            <Text style={styles.securityText}>Secure Checkout</Text>
        </View>
      </View>
    </ThemedView>
  );
}

// Helper function to format currency, can be placed outside the component
const formatToKsh = (amount: number): string => `KSh ${amount.toLocaleString('en-KE')}`;


const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: '#f9f9f9' },
    scrollViewContent: { paddingHorizontal: 20 },
    glassHeader: { paddingTop: Platform.OS === 'ios' ? 50 : 30, paddingBottom: 18, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, backgroundColor: 'rgba(245, 243, 255, 0.75)', overflow: 'hidden', shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(94, 53, 177, 0.1)' },
    glassCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40 },
    glassCircleTop: { top: -30, left: -20, backgroundColor: 'rgba(148, 108, 230, 0.12)' },
    glassCircleBottom: { bottom: -40, right: -30, backgroundColor: 'rgba(94, 53, 177, 0.08)' },
    glassBackButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(94, 53, 177, 0.12)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(94, 53, 177, 0.08)', shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
    glassTitleContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(94, 53, 177, 0.08)', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(94, 53, 177, 0.05)', marginHorizontal: 10, justifyContent: 'center' },
    serviceIconPreview: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    glassHeaderTitle: { fontWeight: '700', fontSize: 18, color: '#2D1155' },
    serviceChangeButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(94, 53, 177, 0.12)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(94, 53, 177, 0.08)' },
    serviceOverviewCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    serviceIconBg: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 15, backgroundColor: 'rgba(255,255,255,0.2)' },
    serviceInfo: { flex: 1 },
    serviceTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 },
    serviceDescription: { fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20 },
    changeServiceButton: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    changeServiceButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
    sectionCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionSubtitle: { fontSize: 18, fontWeight: '700', color: '#333' },
    helperLink: { fontSize: 14, color: '#5E35B1', fontWeight: '500' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
    inputIcon: { marginRight: 12, color: '#5E35B1' },
    inputField: { flex: 1 },
    inputLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
    inputValue: { fontSize: 16, fontWeight: '500', color: '#333' },
    inputHelperText: { fontSize: 12, color: '#777', marginLeft: 15, fontStyle: 'italic' },
    weightIndicator: { height: 4, backgroundColor: '#eee', borderRadius: 2, marginVertical: 10, overflow: 'hidden' },
    weightIndicatorBar: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 2 },
    textAreaContainer: { minHeight: 120, alignItems: 'flex-start' },
    textAreaValue: { fontSize: 16, fontWeight: '500', color: '#333', flex: 1, textAlignVertical: 'top', lineHeight: 22 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    summaryLabel: { fontSize: 15, color: '#555' },
    summaryValue: { fontSize: 15, fontWeight: '600', color: '#333' },
    discountValue: { color: '#4CAF50' },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
    totalLabel: { fontSize: 18, fontWeight: '700', color: '#333' },
    totalValue: { fontSize: 22, fontWeight: '700', color: '#5E35B1' },
    paymentMethod: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
    paymentMethodText: { fontSize: 14, color: '#555', marginLeft: 10, flex: 1 },
    changePaymentText: { fontSize: 14, color: '#5E35B1', fontWeight: '500' },
    promoCodeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
    promoCodeInput: { flex: 1, fontSize: 16, color: '#333', marginLeft: 10 },
    applyPromoButton: { backgroundColor: '#5E35B1', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
    applyPromoButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
    bottomButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 8 },
    placeOrderButton: { backgroundColor: '#5E35B1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 30, shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
    placeOrderButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
    placeOrderButtonIcon: { marginLeft: 10 },
    securityBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
    securityText: { fontSize: 12, color: '#4CAF50', marginLeft: 5, fontWeight: '500' },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, width: '100%', maxHeight: '80%' },
    modalTitle: { fontWeight: 'bold', fontSize: 20, marginBottom: 20, color: '#333', textAlign: 'center' },
    modalOption: { padding: 16, marginVertical: 5, backgroundColor: '#f5f5f5', borderRadius: 12, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
    modalOptionSelected: { backgroundColor: '#F5F3FF', borderColor: '#5E35B1' },
    modalOptionText: { color: '#333', fontSize: 16, fontWeight: '600' },
    modalOptionTextSelected: { color: '#5E35B1' },
    modalCloseButton: { marginTop: 24, alignSelf: 'center', padding: 10 },
    modalCloseText: { color: '#5E35B1', fontWeight: 'bold', fontSize: 16 },
    addressItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', width: '100%' },
    selectedAddressItem: { backgroundColor: '#F5F3FF' },
    addressDetails: { flex: 1, marginLeft: 15 },
    addressName: { fontSize: 16, fontWeight: '600', color: '#333' },
    addressText: { fontSize: 14, color: '#666', marginTop: 4 },
    defaultTag: { backgroundColor: '#5E35B1', color: 'white', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 5, fontSize: 12, fontWeight: '600' },
    addAddressButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginTop: 10, width: '100%', justifyContent: 'center', backgroundColor: '#F5F3FF', borderRadius: 12, borderWidth: 1, borderColor: '#D1C4E9' },
    addAddressText: { marginLeft: 15, fontSize: 16, color: '#5E35B1', fontWeight: '600' },
    detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    detailIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    detailContent: { flex: 1 },
    detailLabel: { fontSize: 13, color: '#888', marginBottom: 3 },
    detailValue: { fontSize: 16, fontWeight: '600', color: '#333' },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginTop: 10 },
    checkboxText: { fontSize: 15, marginLeft: 10, color: '#555' },
});