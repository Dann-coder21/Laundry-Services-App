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
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart, CartItem } from '../context/CartContext';

// --- Type Definitions ---
type IroningItem = Omit<CartItem, 'serviceType'>;

// --- Dummy Data ---
const ironingItemsData: IroningItem[] = [
  { id: 'shirt', name: 'Shirt', price: 50.00, icon: 'tshirt-crew', quantity: 0 },
  { id: 'trousers', name: 'Trousers/Pants', price: 70.00, icon: 'account-tie', quantity: 0 },
  { id: 'dress', name: 'Dress', price: 120.00, icon: 'hanger', quantity: 0 },
  { id: 'skirt', name: 'Skirt', price: 60.00, icon: 'human-female', quantity: 0 },
  { id: 'sari', name: 'Sari', price: 150.00, icon: 'human-female-dance', quantity: 0 },
  { id: 'bedsheet', name: 'Bedsheet', price: 100.00, icon: 'bed-empty', quantity: 0 },
  { id: 'curtain', name: 'Curtain (Small)', price: 80.00, icon: 'curtains', quantity: 0 },
  { id: 'duvet', name: 'Duvet Cover', price: 180.00, icon: 'bed-king', quantity: 0 },
];

export default function OrderIroning() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const primaryColor = '#FF9800';
  const secondaryColor = '#E68900'; // Darker orange for accents

  const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

  const { cartItems, updateServiceItems } = useCart();

  const [items, setItems] = useState<IroningItem[]>(() =>
    ironingItemsData.map(dataItem => {
      const existingItem = cartItems.find(
        cartItem => cartItem.id === dataItem.id && cartItem.serviceType === 'ironing'
      );
      return { ...dataItem, quantity: existingItem?.quantity || 0 };
    })
  );

  const [specialInstructions, setSpecialInstructions] = useState('');
  const totalEstimatedCost = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const buttonScale = new Animated.Value(1);

  const animatePressIn = () => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  const animatePressOut = () => Animated.spring(buttonScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }).start();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  const formatToKsh = (amount: number): string => `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleAddToOrder = () => {
    const selectedItems = items.filter(item => item.quantity > 0);
    if (selectedItems.length === 0) {
      alert('Please add at least one item to your order.');
      return;
    }
    updateServiceItems('ironing', items);
    router.push('/order/cart');
  };

  return (
    <ThemedView style={styles.fullContainer}>
      <Stack.Screen
        options={{
          header: () => (
            <BlurView
              intensity={90}
              tint="light"
              style={[styles.glassHeader, { height: HEADER_HEIGHT }]}
            >
              <View style={[styles.glassCircle, styles.glassCircleTop, { backgroundColor: `${primaryColor}20` }]} />
              <View style={[styles.glassCircle, styles.glassCircleBottom, { backgroundColor: `${secondaryColor}15` }]} />

              <TouchableOpacity onPress={() => router.back()} style={[styles.glassBackButton, { backgroundColor: `${primaryColor}20`, borderColor: `${primaryColor}10` }]} activeOpacity={0.8}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={primaryColor} />
              </TouchableOpacity>

              <View style={[styles.glassTitleContainer, { backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}10` }]}>
                <View style={[styles.serviceIconPreview, { backgroundColor: primaryColor }]}>
                  <MaterialCommunityIcons name="iron-outline" size={20} color="white" />
                </View>
                <Text style={[styles.glassHeaderTitle, { color: secondaryColor }]}>Order Ironing</Text>
              </View>

              <TouchableOpacity onPress={handleAddToOrder} style={[styles.glassBackButton, { backgroundColor: `${primaryColor}20`, borderColor: `${primaryColor}10` }]} activeOpacity={0.8}>
                <MaterialCommunityIcons name="cart-outline" size={24} color={primaryColor} />
                {totalItemsCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{totalItemsCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </BlurView>
          ),
          headerTransparent: true,
          headerShadowVisible: false, // This line removes the black border
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: HEADER_HEIGHT + 20, paddingBottom: 160 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.heroIconBackground, { backgroundColor: `${primaryColor}20` }]}>
            <MaterialCommunityIcons name="iron-outline" size={60} color={primaryColor} />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>Ironing Service</ThemedText>
          <ThemedText style={styles.heroTagline}>Professional pressing for a wrinkle-free finish.</ThemedText>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Select Items for Ironing</ThemedText>
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.garmentItem}>
                <View style={styles.garmentInfo}>
                  <MaterialCommunityIcons name={item.icon as any} size={28} color={primaryColor} style={styles.garmentIcon} />
                  <View>
                    <ThemedText style={styles.garmentName}>{item.name}</ThemedText>
                    <ThemedText style={styles.itemPrice}>{formatToKsh(item.price)} / item</ThemedText>
                  </View>
                </View>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={[styles.quantityButton, { backgroundColor: primaryColor }, item.quantity === 0 && styles.quantityButtonDisabled]}
                    onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity === 0}
                  >
                    <MaterialCommunityIcons name="minus" size={20} color={item.quantity === 0 ? '#bbb' : 'white'} />
                  </TouchableOpacity>
                  <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
                  <TouchableOpacity
                    style={[styles.quantityButton, { backgroundColor: primaryColor }]}
                    onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
          <View style={styles.totalSummary}>
            <ThemedText style={styles.totalSummaryLabel}>Total Items:</ThemedText>
            <ThemedText style={styles.totalSummaryValue}>{totalItemsCount}</ThemedText>
          </View>
          <View style={styles.totalSummary}>
            <ThemedText style={styles.totalSummaryLabel}>Estimated Cost:</ThemedText>
            <ThemedText style={styles.totalSummaryValue}>{formatToKsh(totalEstimatedCost)}</ThemedText>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Special Instructions</ThemedText>
          <View style={styles.inputContainer}>
            <MaterialIcons name="sticky-note-2" size={20} color="#888" style={styles.inputIcon} />
            <View style={styles.inputField}>
              <TextInput value={specialInstructions} onChangeText={setSpecialInstructions} style={styles.textAreaValue} multiline placeholder="e.g., Use low heat, starch preference..." placeholderTextColor="#999" />
            </View>
          </View>
        </View>
      </ScrollView>

      {totalItemsCount > 0 && (
        <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + 15 }]}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.addToOrderButton, { backgroundColor: primaryColor }]}
              activeOpacity={0.8}
              onPressIn={animatePressIn}
              onPressOut={animatePressOut}
              onPress={handleAddToOrder}
            >
              <Text style={styles.addToOrderButtonText}>Add to Order - {formatToKsh(totalEstimatedCost)}</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="white" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </ThemedView>
  );
}

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
    backgroundColor: 'rgba(255, 250, 240, 0.75)',
    overflow: 'hidden',
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
  glassHeaderTitle: { fontWeight: '700', fontSize: 18 },
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
    borderColor: 'white'
  },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  heroSection: { alignItems: 'center', paddingVertical: 30, marginBottom: 10 },
  heroIconBackground: { borderRadius: 40, width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  heroTitle: { marginTop: 0, fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  heroTagline: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 5, maxWidth: '85%', lineHeight: 22 },
  sectionCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  sectionSubtitle: { fontSize: 19, fontWeight: '700', marginBottom: 15, color: '#333' },
  garmentItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  garmentInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  garmentIcon: { marginRight: 15 },
  garmentName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemPrice: { fontSize: 13, color: '#777', marginTop: 2 },
  quantityControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 20, overflow: 'hidden' },
  quantityButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', margin: 2 },
  quantityButtonDisabled: { backgroundColor: '#E0E0E0' },
  quantityText: { fontSize: 16, fontWeight: 'bold', color: '#333', minWidth: 30, textAlign: 'center' },
  totalSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  totalSummaryLabel: { fontSize: 16, fontWeight: '600', color: '#555' },
  totalSummaryValue: { fontSize: 18, fontWeight: 'bold', color: '#FF9800' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  inputIcon: { marginRight: 12, marginTop: Platform.OS === 'ios' ? 0 : 4 },
  inputField: { flex: 1 },
  textAreaValue: { fontSize: 16, fontWeight: '500', color: '#333', flex: 1, textAlignVertical: 'top', lineHeight: 22, padding: 0, margin: 0 },
  bottomButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 8 },
  addToOrderButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 30, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  addToOrderButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },
});