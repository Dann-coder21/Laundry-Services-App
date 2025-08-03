import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useCart} from '../context/CartContext';// --- 1. Import the global cart hook

const OrderSummary = () => {
  const router = useRouter();
  const primaryColor = '#5E35B1';
  const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

  // --- 2. Get ALL data from the global cart context ---
  // This replaces the entire block of useLocalSearchParams and parseFloat.
  const { cartItems, subtotal, deliveryFee, discount = 0, tax, total } = useCart();

  // --- Local state for UI (animations, etc.) remains the same ---
  const buttonScale = new Animated.Value(1);

  // --- Dummy data that should come from a user/auth context in a real app ---
  // These are kept here as placeholders. In a full app, they might come from another context or params.
  const params = useLocalSearchParams();
  const pickupDate = params.pickupDate || 'N/A';
  const pickupTime = params.pickupTime || 'N/A';
  const deliveryAddressDetails = params.deliveryAddressDetails || 'Address Details';
  const paymentMethodType = params.paymentMethodType || 'VISA';
  const paymentMethodLast4 = params.paymentMethodLast4 || '0000';
  const specialInstructionsText = params.specialInstructions || 'No special instructions.';


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

  const formatToKsh = (amount: number) => {
    return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleConfirmAndPay = () => {
    // This is where you would trigger the payment processing logic
    console.log("Proceeding to payment with total:", total);
    // On success, you might navigate to a confirmation screen
    // router.push('/order/Order-confirmation');
    // And potentially clear the cart
    // clearCart();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => (
            <BlurView
              intensity={90}
              tint="light"
              style={[styles.glassHeader, { height: HEADER_HEIGHT }]}
            >
              <View style={[styles.glassCircle, styles.glassCircleTop]} />
              <View style={[styles.glassCircle, styles.glassCircleBottom]} />

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.glassBackButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color={primaryColor} />
              </TouchableOpacity>

              <View style={styles.glassTitleContainer}>
                <View
                  style={[
                    styles.serviceIconPreview,
                    { backgroundColor: primaryColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="clipboard-check-outline"
                    size={20}
                    color="white"
                  />
                </View>
                <Text style={styles.glassHeaderTitle}>Order Summary</Text>
              </View>
            </BlurView>
          ),
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- 3. Render all items dynamically from the global cart --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Your Items</Text>
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <View key={`${item.serviceType}-${item.id}`} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{`${item.quantity}x ${item.name}`}</Text>
                  {/* Display the service type for clarity */}
                  <Text style={styles.itemServiceType}>{item.serviceType}</Text>
                </View>
                <Text style={styles.itemPrice}>{formatToKsh(item.price * item.quantity)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.infoText}>Your order is empty.</Text>
          )}
        </View>

        {/* --- These sections are still using placeholder data --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={20} color="#5E35B1" />
            <Text style={styles.infoText}>{pickupDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={20} color="#5E35B1" />
            <Text style={styles.infoText}>{pickupTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#5E35B1" />
            <Text style={styles.infoText}>{deliveryAddressDetails}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => router.back()}>
            <Text style={styles.editButtonText}>Edit Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentCard} onPress={() => router.push('/payment/payment-methods')}>
            <FontAwesome name="credit-card" size={24} color="#555" />
            <View style={styles.paymentTextContainer}>
              <Text style={styles.paymentType}>{paymentMethodType}</Text>
              <Text style={styles.paymentNumber}>•••• {paymentMethodLast4}</Text>
            </View>
            <Text style={styles.changePaymentText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* --- 4. Render all financial data from the global cart context --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatToKsh(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatToKsh(deliveryFee)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{formatToKsh(tax)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>-{formatToKsh(discount)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatToKsh(total)}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <Text style={styles.instructionsText}>{specialInstructionsText}</Text>
        </View>
      </ScrollView>


      {/* --- 5. Footer now reads from context and navigates simply --- */}
      <View style={styles.footer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.8}
            onPressIn={animatePressIn}
            onPressOut={animatePressOut}
            onPress={handleConfirmAndPay} // Attach the payment handler
          >
            <Text style={styles.confirmButtonText}>Confirm & Pay {formatToKsh(total)}</Text>
            <MaterialCommunityIcons name="lock" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          // This simply navigates. The global context preserves the cart state automatically.
          onPress={() => router.replace('/order/select-service')}
        >
          <Text style={styles.secondaryButtonText}>Choose Another Service</Text>
          <MaterialCommunityIcons name="plus" size={18} color="#5E35B1" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <View style={styles.securityBadge}>
          <MaterialCommunityIcons name="shield-check" size={16} color="#4CAF50" />
          <Text style={styles.securityText}>Secure Payment • 256-bit Encryption</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    paddingBottom: 220,
    paddingHorizontal: 20,
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
  glassBackButton: {
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
  glassTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // --- New style for the service type label ---
  itemServiceType: {
    fontSize: 13,
    color: '#666',
    textTransform: 'capitalize',
    fontStyle: 'italic',
    marginTop: 3,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  editButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  editButtonText: {
    color: '#5E35B1',
    fontWeight: '600',
    fontSize: 15,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  paymentTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  changePaymentText: {
    color: '#5E35B1',
    fontWeight: '600',
    fontSize: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  discountValue: {
    color: '#4CAF50',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
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
  instructionsText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  confirmButton: {
    backgroundColor: '#5E35B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  secondaryButton: {
    marginTop: 4,
    backgroundColor: '#F3EFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#5E35B1',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#5E35B1',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default OrderSummary;