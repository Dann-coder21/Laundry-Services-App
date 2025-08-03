import { Stack, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BlurView } from 'expo-blur';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart, CartItem } from '../context/CartContext';

// --- Type Definitions ---
type DryCleanItem = Omit<CartItem, 'serviceType'>;

// --- Dummy Data ---
const dryCleanItemsData: DryCleanItem[] = [
    { id: 'suit', name: 'Suit (2 pcs)', icon: 'hanger', price: 1200, quantity: 0 },
    { id: 'dress', name: 'Dress', icon: 'hanger', price: 800, quantity: 0 },
    { id: 'shirt', name: 'Shirt', icon: 'tshirt-crew', price: 350, quantity: 0 },
    { id: 'trousers', name: 'Trousers/Pants', icon: 'account-tie', price: 450, quantity: 0 },
    { id: 'jacket', name: 'Jacket', icon: 'coat-rack', price: 1000, quantity: 0 },
    { id: 'blouse', name: 'Blouse', icon: 'tshirt-crew-outline', price: 300, quantity: 0 },
    { id: 'skirt', name: 'Skirt', icon: 'human-female', price: 400, quantity: 0 },
    { id: 'coat', name: 'Coat (Heavy)', icon: 'coat-rack', price: 1500, quantity: 0 },
    { id: 'tie', name: 'Tie', icon: 'tie', price: 200, quantity: 0 },
];

export default function OrderDryclean() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const primaryColor = '#2196F3'; // Updated to a blue for Dry Clean
  const secondaryColor = '#5E35B1'; // Kept purple for accents

  // --- NEW: Define a consistent header height ---
  const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

  const { cartItems, updateServiceItems } = useCart();

  const [items, setItems] = useState<DryCleanItem[]>(() =>
    dryCleanItemsData.map(dataItem => {
      const existingItem = cartItems.find(
        cartItem => cartItem.id === dataItem.id && cartItem.serviceType === 'dryClean'
      );
      return { ...dataItem, quantity: existingItem?.quantity || 0 };
    })
  );

  const [specialInstructions, setSpecialInstructions] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
  const [deliveryTime, setDeliveryTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'pickup' | 'delivery'>('pickup');

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = 300;
  const taxRate = 0.16;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;

  const handleQuantityChange = (id: string, delta: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || (pickerMode === 'pickup' ? pickupDate : deliveryDate);
    setShowDatePicker(Platform.OS === 'ios');
    if (pickerMode === 'pickup') setPickupDate(currentDate);
    else setDeliveryDate(currentDate);
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || (pickerMode === 'pickup' ? pickupTime : deliveryTime);
    setShowTimePicker(Platform.OS === 'ios');
    if (pickerMode === 'pickup') setPickupTime(currentTime);
    else setDeliveryTime(currentTime);
  };

  const showDatepickerFor = (mode: 'pickup' | 'delivery') => { setPickerMode(mode); setShowDatePicker(true); };
  const showTimepickerFor = (mode: 'pickup' | 'delivery') => { setPickerMode(mode); setShowTimePicker(true); };

  const handlePlaceOrder = () => {
    const selectedItems = items.filter(item => item.quantity > 0);
    if (selectedItems.length === 0) {
      alert("Please select at least one item.");
      return;
    }
    updateServiceItems('dryClean', items);
    router.push('/order/order-summary');
  };
  
  const formatToKsh = (amount: number): string => `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatDate = (date: Date): string => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const formatTime = (date: Date): string => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <ThemedView style={styles.fullContainer}>
      {/* --- MODIFIED: Header structure replaced to match OrderService --- */}
      <Stack.Screen
        options={{
          header: () => (
            <BlurView intensity={90} tint="light" style={[styles.glassHeader, { height: HEADER_HEIGHT }]}>
              {/* Decorative circles with new theme color */}
              <View style={[styles.glassCircle, styles.glassCircleTop, { backgroundColor: `${primaryColor}20` }]} />
              <View style={[styles.glassCircle, styles.glassCircleBottom, { backgroundColor: `${secondaryColor}15` }]} />

              {/* Back Button */}
              <TouchableOpacity onPress={() => router.back()} style={[styles.glassBackButton, { backgroundColor: `${primaryColor}20`, borderColor: `${primaryColor}10`}]} activeOpacity={0.8}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={primaryColor} />
              </TouchableOpacity>

              {/* Centered Title Container */}
              <View style={[styles.glassTitleContainer, { backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}10`}]}>
                <View style={[styles.serviceIconPreview, { backgroundColor: primaryColor }]}>
                  <MaterialCommunityIcons name="hanger" size={20} color="white" />
                </View>
                <Text style={[styles.glassHeaderTitle, { color: primaryColor }]}>Dry Clean Order</Text>
              </View>

              {/* Right-side Action Button (Cart) */}
              <TouchableOpacity onPress={handlePlaceOrder} style={[styles.glassBackButton, { backgroundColor: `${primaryColor}20`, borderColor: `${primaryColor}10`}]} activeOpacity={0.8}>
                <MaterialCommunityIcons name="cart-outline" size={24} color={primaryColor} />
                {totalItems > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{totalItems}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </BlurView>
          ),
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />

      {showDatePicker && <DateTimePicker value={pickerMode === 'pickup' ? pickupDate : deliveryDate} mode="date" display="default" minimumDate={new Date()} onChange={onDateChange} />}
      {showTimePicker && <DateTimePicker value={pickerMode === 'pickup' ? pickupTime : deliveryTime} mode="time" display="default" onChange={onTimeChange} />}

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: HEADER_HEIGHT + 20, paddingBottom: 120 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.heroIconBackground, { backgroundColor: `${primaryColor}20` }]}>
            <MaterialCommunityIcons name="hanger" size={60} color={primaryColor} />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>Dry Clean Service</ThemedText>
          <ThemedText style={styles.heroTagline}>Select your garments for expert dry cleaning.</ThemedText>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Select Your Garments</ThemedText>
          {items.map(item => (
            <View key={item.id} style={styles.garmentItem}>
              <View style={styles.garmentInfo}>
                <MaterialCommunityIcons name={item.icon as any} size={28} color={primaryColor} style={styles.garmentIcon} />
                <View>
                  <ThemedText style={styles.garmentName}>{item.name}</ThemedText>
                  <ThemedText style={styles.itemPrice}>{formatToKsh(item.price)} / item</ThemedText>
                </View>
              </View>
              <View style={styles.quantityControl}>
                <TouchableOpacity style={[styles.quantityButton, { backgroundColor: primaryColor }]} onPress={() => handleQuantityChange(item.id, -1)} disabled={item.quantity === 0}>
                  <MaterialCommunityIcons name="minus" size={20} color={'white'} />
                </TouchableOpacity>
                <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                <TouchableOpacity style={[styles.quantityButton, { backgroundColor: primaryColor }]} onPress={() => handleQuantityChange(item.id, 1)}>
                  <MaterialCommunityIcons name="plus" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Schedule Pickup & Delivery</ThemedText>
          <TouchableOpacity style={styles.detailRow} onPress={() => showDatepickerFor('pickup')}>
            <MaterialCommunityIcons name="calendar-arrow-left" size={24} color={secondaryColor} style={styles.detailIcon}/>
            <View style={styles.detailContent}><Text style={styles.detailLabel}>Pickup Date</Text><Text style={styles.detailValue}>{formatDate(pickupDate)}</Text></View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={() => showTimepickerFor('pickup')}>
            <MaterialCommunityIcons name="clock-start" size={24} color={secondaryColor} style={styles.detailIcon}/>
            <View style={styles.detailContent}><Text style={styles.detailLabel}>Pickup Time</Text><Text style={styles.detailValue}>{formatTime(pickupTime)}</Text></View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={() => showDatepickerFor('delivery')}>
            <MaterialCommunityIcons name="calendar-arrow-right" size={24} color="#4CAF50" style={styles.detailIcon}/>
            <View style={styles.detailContent}><Text style={styles.detailLabel}>Delivery Date</Text><Text style={styles.detailValue}>{formatDate(deliveryDate)}</Text></View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Special Instructions</ThemedText>
          <View style={styles.textAreaContainer}>
            <MaterialIcons name="sticky-note-2" size={20} color="#888" style={styles.inputIcon} />
            <TextInput value={specialInstructions} onChangeText={setSpecialInstructions} style={styles.textAreaValue} multiline placeholder="e.g., specific stains, handle with care..." placeholderTextColor="#999" />
          </View>
        </View>
        
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Order Summary</ThemedText>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{formatToKsh(subtotal)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>{formatToKsh(deliveryFee)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Tax (16%)</Text><Text style={styles.summaryValue}>{formatToKsh(tax)}</Text></View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatToKsh(total)}</Text></View>
        </View>
      </ScrollView>

      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={[styles.placeOrderButton, { backgroundColor: secondaryColor }]} activeOpacity={0.8} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order - {formatToKsh(total)}</Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color="white" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

// --- MODIFIED: Styles updated to match OrderService header ---
const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollViewContent: { paddingHorizontal: 20 },
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
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94, 53, 177, 0.1)',
  },
  glassCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40 },
  glassCircleTop: { top: -30, left: -20 },
  glassCircleBottom: { bottom: -40, right: -30 },
  glassBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  glassTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
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
    borderWidth: 1.5,
    borderColor: 'white',
  },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  heroSection: { alignItems: 'center', paddingVertical: 20 },
  heroIconBackground: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  heroTagline: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 5 },
  sectionCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  sectionSubtitle: { fontSize: 19, fontWeight: '700', marginBottom: 15, color: '#333' },
  garmentItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  garmentInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 15 },
  garmentIcon: {},
  garmentName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemPrice: { fontSize: 13, color: '#777', marginTop: 2 },
  quantityControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 20, overflow: 'hidden' },
  quantityButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontSize: 16, fontWeight: 'bold', color: '#333', minWidth: 35, textAlign: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  detailIcon: { marginRight: 15 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 13, color: '#888', marginBottom: 2 },
  detailValue: { fontSize: 16, fontWeight: '500', color: '#333' },
  textAreaContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F5F5F5', borderRadius: 10, padding: 15, minHeight: 100 },
  inputIcon: { marginRight: 12, marginTop: 2 },
  textAreaValue: { flex: 1, fontSize: 16, color: '#333', textAlignVertical: 'top' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 15, color: '#555' },
  summaryValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#333' },
  totalValue: { fontSize: 22, fontWeight: '700', color: '#5E35B1' },
  bottomButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eee' },
  placeOrderButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 30, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10 },
  placeOrderButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});