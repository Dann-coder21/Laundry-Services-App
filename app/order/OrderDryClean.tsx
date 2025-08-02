import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput, // Uncommented based on previous usage
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Keep this import
import { FlatList } from 'react-native';
import { Modal } from 'react-native';


// Define types
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
  const insets = useSafeAreaInsets(); // Crucial for precise layout

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

  // --- REVISED HEADER HEIGHT CALCULATION ---
  // This calculation is now consistent with DryCleanScreen's header structure.
  // It sums the dynamic safe area top inset, the estimated height of the content row,
  // and the fixed bottom padding of the header.
  const HEADER_INTERNAL_BOTTOM_PADDING = 18;
  const HEADER_CONTENT_HEIGHT_ESTIMATE = 42; // Based on back button/cart button height (e.g., 42px width/height)

  const DYNAMIC_HEADER_TOTAL_HEIGHT = insets.top + HEADER_CONTENT_HEIGHT_ESTIMATE + HEADER_INTERNAL_BOTTOM_PADDING;
  // --- END REVISED HEADER HEIGHT CALCULATION ---


  // --- Original state variables from OrderService that were missing but needed ---
  const buttonScale = new Animated.Value(1); // For animated button press
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Service Data (Assuming this component can be used for other services too, or passed via params)
  const [selectedService, setSelectedService] = useState<ServiceType>({
    id: '1',
    title: 'Dry Clean', // Changed from Wash & Fold to match the component name
    description: 'Professional dry cleaning',
    iconName: 'hanger',
    iconSet: MaterialCommunityIcons,
    color: '#2196F3', // Primary Dry Clean color
    gradient: ['#2196F3', '#64B5F6'], // Dry Clean gradient
  });

  // Weight Options
  const weightOptions = [
    { label: '3 - 6 kgs', value: 7.5, price: 400 },
    { label: '7 - 10 kgs', value: 15, price: 750 },
    { label: '11 - 14 kgs', value: 25, price: 1000 },
    { label: '15 - 18 lbs', value: 35, price: 1250 },
  ];
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0]);

  // Pickup and Delivery Details
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [deliveryDate, setDeliveryDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Tomorrow
  const [deliveryTime, setDeliveryTime] = useState(new Date());

  // Address Options
  const addressOptions = [
    { id: '1', name: 'Home', details: '123 Main St, Nairobi, Kenya', isDefault: true },
    { id: '2', name: 'Work', details: '456 Business Park, Westlands, Nairobi', isDefault: false },
    { id: '3', name: 'Campus', details: 'University Way, Nairobi', isDefault: false },
  ];
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addressOptions.find(a => a.isDefault) || addressOptions[0]);

  // Order Details
  // specialInstructions is already declared above
  const [isDeliverySameAsPickup, setIsDeliverySameAsPickup] = useState(true);

  // Pricing
  const deliveryFee = 500;
  const discount = 0;
  const subtotal = selectedWeight.price;
  const taxRate = 0.16;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + deliveryFee - discount + tax;

  // Animation Handlers
  const animatePressIn = () => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  const animatePressOut = () => Animated.spring(buttonScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();
  const ServiceIconComponent = selectedService.iconSet || MaterialCommunityIcons;

  // Formatting Functions
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // --- End of re-added state variables ---


  return (
    <ThemedView style={styles.fullContainer}>
     <Stack.Screen
       options={{
         header: () => (
           <BlurView
             intensity={90}
             tint="light"
             style={styles.glassHeader} // Use the unified glassHeader style
           >
             {/* Decorative elements */}
             <View style={[styles.glassCircle, styles.glassCircleTop]} />
             <View style={[styles.glassCircle, styles.glassCircleBottom]} />

             {/* Back Button - Styled like DryCleanScreen's dryCleanBackButton */}
             <TouchableOpacity
               onPress={() => router.back()}
               style={styles.glassBackButton}
               activeOpacity={0.8}
             >
               <MaterialCommunityIcons
                 name="arrow-left"
                 size={24}
                 color="#5E35B1" // Consistent color
               />
             </TouchableOpacity>

             {/* Title with Icon - Styled like DryCleanScreen's dryCleanTitleContainer */}
             <View style={styles.glassTitleContainer}>
               <MaterialCommunityIcons
                 name="hanger" // Icon for Dry Clean
                 size={24}
                 color="#5E35B1" // Consistent color
                 style={styles.glassTitleIcon}
               />
               <Text style={styles.glassHeaderTitle}>
                 Dry Clean Order
               </Text>
             </View>

             {/* Cart Preview Button - Styled like DryCleanScreen's infoButton but with badge */}
             <TouchableOpacity
               style={styles.cartPreviewButton}
               onPress={() => router.push('/order/cart')}
               activeOpacity={0.8}
             >
               <MaterialCommunityIcons
                 name="cart-outline"
                 size={24}
                 color="#5E35B1" // Consistent color
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

    {/* DateTimePickers should be outside the ScrollView */}
    {showDatePicker && (
      <DateTimePicker
        value={pickupDate}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowDatePicker(Platform.OS === 'ios'); // iOS stays open
          if (selectedDate) setPickupDate(selectedDate);
        }}
      />
    )}

    {showTimePicker && (
      <DateTimePicker
        value={pickupTime}
        mode="time"
        display="default"
        onChange={(event, selectedTime) => {
          setShowTimePicker(Platform.OS === 'ios');
          if (selectedTime) setPickupTime(selectedTime);
        }}
      />
    )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          // Now, this paddingTop uses the TOTAL calculated height of the custom header.
          { paddingTop: DYNAMIC_HEADER_TOTAL_HEIGHT + 20, paddingBottom: 160 + insets.bottom }
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
                    style={[styles.quantityButton, {backgroundColor: primaryColor}, item.quantity === 0 && styles.quantityButtonDisabled]} // Use primaryColor
                    onPress={() => decrementQuantity(item.id)}
                    disabled={item.quantity === 0}
                  >
                    <MaterialCommunityIcons name="minus" size={20} color={item.quantity === 0 ? '#bbb' : 'white'} />
                  </TouchableOpacity>
                  <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                  <TouchableOpacity
                    style={[styles.quantityButton, {backgroundColor: primaryColor}]} // Use primaryColor
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
              <TextInput value={specialInstructions} onChangeText={setSpecialInstructions} style={styles.textAreaValue} multiline={true} numberOfLines={4} placeholder="e.g., specific stains, repair needs, delicate handling..." placeholderTextColor="#999" />
            </View>
          </View>
        </View>

        {/* Pickup Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Pickup Details</Text>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() =>{ setShowDatePicker(true);}}
          >
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}>
              <MaterialCommunityIcons name="calendar" size={20} color={primaryColor} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Date</Text>
              <Text style={styles.detailValue}>{formatDate(pickupDate)}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => {
              console.log('Setting showTimePicker to true');
              setShowTimePicker(true);
            }}
          >
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}>
              <MaterialCommunityIcons name="clock" size={20} color={primaryColor} />
            </View>
           <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Time</Text>
              <Text style={styles.detailValue}>{formatTime(pickupTime)}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => setAddressModalVisible(true)}
          >
            <View style={[styles.detailIconContainer, { backgroundColor: '#EDE7F6' }]}>
              <MaterialCommunityIcons name="map-marker" size={20} color={primaryColor} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pickup Address</Text>
              <View style={styles.addressBadge}>
                <Text style={[styles.addressBadgeText, { backgroundColor: '#E0F7FA', color: '#00838F' }]}>
                  {selectedAddress.name}
                </Text>
                {selectedAddress.isDefault &&
                  <Text style={styles.defaultBadgeText}>Default</Text>}
              </View>
              <Text style={styles.addressText}>{selectedAddress.details}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Delivery Details Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Delivery Details</Text>

          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => console.log('Change delivery date')}
          >
            <View style={[styles.detailIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="calendar-arrow-right" size={20} color="#4CAF50" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Date</Text>
              <Text style={styles.detailValue}>{formatDate(deliveryDate)}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => console.log('Change delivery time')}
          >
            <View style={[styles.detailIconContainer, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Time</Text>
              <Text style={styles.detailValue}>{formatTime(deliveryTime)}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>




          <View style={styles.checkboxRow}>
            <TouchableOpacity onPress={() => setIsDeliverySameAsPickup(!isDeliverySameAsPickup)}>
              {isDeliverySameAsPickup ?
                <MaterialIcons name="check-box" size={24} color={primaryColor} /> :
                <MaterialIcons name="check-box-outline-blank" size={24} color="#ccc" />
              }
            </TouchableOpacity>
            <Text style={styles.checkboxText}>Delivery address same as pickup</Text>
          </View>

          {!isDeliverySameAsPickup && (
            <TouchableOpacity
              style={styles.detailRow}
              onPress={() => setAddressModalVisible(true)}
            >
              <View style={[styles.detailIconContainer, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="truck-delivery" size={20} color="#4CAF50" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Delivery Address</Text>
                <Text style={styles.addressText}>Select delivery address...</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Special Instructions</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}><MaterialIcons name="sticky-note-2" size={24} color={primaryColor} style={styles.inputIcon} /><TextInput value={specialInstructions} onChangeText={setSpecialInstructions} style={styles.textAreaValue} multiline={true} numberOfLines={4} placeholder="Any special requests for your order..." placeholderTextColor="#999" /></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Order Summary</Text>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>KSh {subtotal.toLocaleString('en-KE')}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>KSh {deliveryFee.toLocaleString('en-KE')}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax (16%)</Text><Text style={styles.summaryValue}>KSh {tax.toLocaleString('en-KE')}</Text></View>
          {discount > 0 && <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Discount</Text><Text style={[styles.summaryValue, styles.discountValue]}>-KSh {discount.toLocaleString('en-KE')}</Text></View>}
          <View style={styles.divider} />
          <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>KSh {total.toLocaleString('en-KE')}</Text></View>
          <View style={styles.paymentMethod}><MaterialCommunityIcons name="cellphone" size={20} color="#555" /><Text style={styles.paymentMethodText}>M-PESA •••• 2547</Text><TouchableOpacity onPress={() => router.push('/payment/payment-methods')}><Text style={styles.changePaymentText}>Change</Text></TouchableOpacity></View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.promoCodeContainer}><MaterialCommunityIcons name="ticket-percent" size={24} color={primaryColor} style={styles.inputIcon} /><TextInput style={styles.promoCodeInput} placeholder="Enter promo code" placeholderTextColor="#999" /><TouchableOpacity style={styles.applyPromoButton}><Text style={styles.applyPromoButtonText}>Apply</Text></TouchableOpacity></View>
        </View>
      </ScrollView>

      <Modal visible={addressModalVisible} transparent animationType="slide" onRequestClose={() => setAddressModalVisible(false)}>
        <View style={styles.modalContainer}><View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Delivery Address</Text>
            <FlatList data={addressOptions} keyExtractor={(item) => item.id} renderItem={({ item }) => (<TouchableOpacity style={[styles.addressItem, selectedAddress.id === item.id && styles.selectedAddressItem]} onPress={() => { setSelectedAddress(item); setAddressModalVisible(false); }}>
                  <MaterialIcons name="location-on" size={24} color={selectedAddress.id === item.id ? primaryColor : '#888'} /><View style={styles.addressDetails}><Text style={styles.addressName}>{item.name}</Text><Text style={styles.addressText}>{item.details}</Text>{item.isDefault && <Text style={styles.defaultTag}>Default</Text>}</View>{selectedAddress.id === item.id && <MaterialIcons name="check" size={24} color={primaryColor} />}</TouchableOpacity>)} />
            <TouchableOpacity style={styles.addAddressButton} onPress={() => { setAddressModalVisible(false); router.push('/address/add'); }}><MaterialIcons name="add" size={24} color={primaryColor} /><Text style={styles.addAddressText}>Add New Address</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setAddressModalVisible(false)}><Text style={styles.modalCloseText}>Cancel</Text></TouchableOpacity>
        </View></View>
      </Modal>

      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + 15 }]}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}><TouchableOpacity style={styles.placeOrderButton} activeOpacity={0.8} onPress={() => router.push({ pathname: '/order/order-summary', params: { itemName: selectedService.title, itemPrice: selectedWeight.price.toString(), subtotal: subtotal.toString(), deliveryFee: deliveryFee.toString(), discount: discount.toString(), tax: tax.toString(), total: total.toString(), pickupDate: formatDate(pickupDate), pickupTime: formatTime(pickupTime), deliveryDate: formatDate(deliveryDate), deliveryTime: formatTime(deliveryTime), deliveryAddressDetails: selectedAddress.details, paymentMethodType: 'M-PESA', paymentMethodLast4: '2547', specialInstructions: specialInstructions, }})} onPressIn={animatePressIn} onPressOut={animatePressOut}><Text style={styles.placeOrderButtonText}>Place Order - KSh {total.toLocaleString('en-KE')}</Text><MaterialCommunityIcons name="arrow-right" size={20} color="white" style={styles.placeOrderButtonIcon} /></TouchableOpacity></Animated.View>
        <View style={styles.securityBadge}><MaterialCommunityIcons name="shield-check" size={16} color="#4CAF50" /><Text style={styles.securityText}>Secure Payment</Text></View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollViewContent: {
    paddingHorizontal: 20,
    // paddingTop and paddingBottom are set dynamically inline in the component
  },
  // --- HEADER STYLES (now includes position: 'absolute' and zIndex) ---
  glassHeader: {
    // This paddingTop dynamically includes the safe area on iOS and aligns on Android
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // These values are your design intent for header top padding
    paddingBottom: 18,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(245, 243, 255, 0.75)', // Adjusted to match DryCleanScreen's header color
    overflow: 'hidden',
    shadowColor: '#5E35B1', // Adjusted to match DryCleanScreen's header shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94, 53, 177, 0.1)', // Adjusted to match DryCleanScreen's header border
    position: 'absolute', // Make it float
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it's above the scroll view content
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
    backgroundColor: 'rgba(148, 108, 230, 0.12)', // Consistent with DryCleanScreen
  },
  glassCircleBottom: {
    bottom: -40,
    right: -30,
    backgroundColor: 'rgba(94, 53, 177, 0.08)', // Consistent with DryCleanScreen
  },

  // --- Header Internal Component Styles (Copied from DryCleanScreen's equivalent) ---
  glassBackButton: { // Replaces the old glassBackButton style
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
  glassTitleContainer: { // Replaces the old glassTitleContainer style
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
  },
  glassTitleIcon: { // Replaces the old glassTitleIcon style
    marginRight: 10,
  },
  glassHeaderTitle: { // Replaces the old glassHeaderTitle style
    fontWeight: '700',
    fontSize: 18,
    color: '#2D1155', // Consistent with DryCleanScreen's header title color
  },
  cartPreviewButton: { // Style adapted from DryCleanScreen's infoButton
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
    position: 'relative', // Keep this for the badge
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


  // --- Other existing styles ---
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

  garmentsList: {},
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
  orderButton: {
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
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  orderButtonIcon: {
    marginLeft: 10,
  },
  // Additional styles from OrderService.js which were used or needed
  serviceOverviewCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  serviceIconBg: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 15, backgroundColor: 'rgba(255,255,255,0.2)' },
  serviceInfo: { flex: 1 },
  serviceTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  serviceDescription: { fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20 },
  changeServiceButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  changeServiceButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  helperLink: { fontSize: 14, color: '#5E35B1', fontWeight: '500' },
  inputLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  inputValue: { fontSize: 16, fontWeight: '500', color: '#333' },
  inputHelperText: { fontSize: 12, color: '#777', marginLeft: 15 },
  weightIndicator: { height: 4, backgroundColor: '#eee', borderRadius: 2, marginBottom: 10, overflow: 'hidden' },
  weightIndicatorBar: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 2 },
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
  promoCodeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  promoCodeInput: { flex: 1, fontSize: 16, color: '#333', marginLeft: 10, padding: 0 },
  applyPromoButton: { backgroundColor: '#5E35B1', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  applyPromoButtonText: { color: 'white', fontWeight: '600', fontSize: 14 },
  placeOrderButton: { backgroundColor: '#5E35B1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 30, shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  placeOrderButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
  placeOrderButtonIcon: { marginLeft: 10 },
  securityBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  securityText: { fontSize: 12, color: '#4CAF50', marginLeft: 5, fontWeight: '500' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 24, width: '80%', alignItems: 'center', maxHeight: '70%' },
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 16, color: '#333', textAlign: 'center'},
  modalOption: { padding: 12, marginVertical: 4, backgroundColor: '#f5f5f5', borderRadius: 8, width: '100%', alignItems: 'center' },
  modalOptionSelected: { backgroundColor: '#5E35B1' },
  modalOptionText: { color: '#333', fontWeight: '600' },
  modalOptionTextSelected: { color: 'white' },
  modalCloseButton: { marginTop: 16 },
  modalCloseText: { color: '#5E35B1', fontWeight: 'bold' },
  addressItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', width: '100%' },
  selectedAddressItem: { backgroundColor: '#F5F3FF' },
  addressDetails: { flex: 1, marginLeft: 15 },
  addressName: { fontSize: 16, fontWeight: '600', color: '#333' },
  addressText: { fontSize: 14, color: '#666', marginTop: 4 },
  defaultTag: { backgroundColor: '#5E35B1', color: 'white', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 5, fontSize: 12, fontWeight: '600' },
  addAddressButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, marginTop: 10, width: '100%', justifyContent: 'center' },
  addAddressText: { marginLeft: 15, fontSize: 16, color: '#5E35B1', fontWeight: '600' },
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkboxText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#555',
  },
});