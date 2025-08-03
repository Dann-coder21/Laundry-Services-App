import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../context/CartContext'; // --- 1. Import the global cart hook

// --- Type Definitions for better code safety ---
type MCIconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface Service {
  id: string;
  title: string;
  description: string;
  iconName: MCIconName;
  iconSet: typeof MaterialCommunityIcons;
  color: string;
  category: 'Wash & Fold' | 'Dry Clean' | 'Ironing' | 'Premium';
}

interface ActiveOrder {
  id: string;
  serviceType: string;
  items: number;
  status: string;
  statusColor: string;
  estimatedCompletion: string;
  icon: MCIconName;
}

const HomeScreen = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Service['category'] | 'All'>('All');
  const [servicePressed, setServicePressed] = useState<string | null>(null);

  // --- 2. Get LIVE data from the Cart Context ---
  // This replaces the old `useState` for `recentOrder`.
  const { subtotal, total, discount = 0, totalItemsCount } = useCart();

  const currentUser = {
    name: 'Dann',
    location: 'Downtown Branch',
  };

  const notificationCount = 1;

  const services: Service[] = [
    { id: '1', title: 'Wash & Fold', description: 'Regular laundry service', iconName: 'washing-machine', iconSet: MaterialCommunityIcons, color: '#4CAF50', category: 'Wash & Fold' },
    { id: '2', title: 'Dry Clean', description: 'Professional dry cleaning', iconName: 'hanger', iconSet: MaterialCommunityIcons, color: '#2196F3', category: 'Dry Clean' },
    { id: '3', title: 'Ironing', description: 'Press only service', iconName: 'iron-outline', iconSet: MaterialCommunityIcons, color: '#FF9800', category: 'Ironing' },
    { id: '4', title: 'Premium', description: 'Delicate & special care', iconName: 'diamond-stone', iconSet: MaterialCommunityIcons, color: '#9C27B0', category: 'Premium' },
  ];

  const [activeOrders] = useState<ActiveOrder[]>([
    { id: 'ORD789', serviceType: 'Wash & Fold', items: 5, status: 'Processing', statusColor: '#FF9800', estimatedCompletion: 'Today, 5:00 PM', icon: 'washing-machine-alert' },
    { id: 'ORD788', serviceType: 'Dry Clean', items: 2, status: 'Ready for Pickup', statusColor: '#4CAF50', estimatedCompletion: 'Ready Now', icon: 'hanger' },
  ]);

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter(service => service.category === activeCategory);
    
  const formatToKsh = (amount: number) => {
    return `KSh ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderServiceItem = ({ item }: { item: Service }) => {
    const IconComponent = item.iconSet || MaterialCommunityIcons;
    const isPressed = servicePressed === item.id;

    const categoryRoutes = {
      'Wash & Fold': 'order/OrderWashAndFold',
      'Dry Clean': 'order/OrderDryClean',
      'Ironing': 'order/OrderIroning',
      'Premium': 'order/premium-order',
    };

    return (
      <Pressable
        onPressIn={() => setServicePressed(item.id)}
        onPressOut={() => setServicePressed(null)}
        onPress={() => router.push(`/${categoryRoutes[item.category]}`)}
        style={({ pressed }) => [
          styles.serviceCard,
          {
            backgroundColor: item.color,
            transform: [{ scale: pressed || isPressed ? 0.95 : 1 }],
            shadowColor: `${item.color}B0`,
          },
          pressed || isPressed ? styles.serviceCardActive : null,
        ]}
      >
        <IconComponent name={item.iconName} size={34} color="white" />
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.serviceDesc}>{item.description}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />

      <BlurView intensity={50} tint="light" style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarIcon}><MaterialIcons name="person" size={32} color="#5E35B1" /></View>
          <View>
            <Text style={styles.greetingModern}>Hello, <Text style={styles.userName}>{currentUser.name}</Text>!</Text>
            <Text style={styles.greetingSub}>Welcome back 👋</Text>
            <View style={styles.locationRow}><MaterialIcons name="location-pin" size={16} color="#5E35B1" /><Text style={styles.locationModern}>{currentUser.location}</Text></View>
          </View>
        </View>
        <TouchableOpacity style={styles.bellContainer} activeOpacity={0.7} onPress={() => router.push('/NotificationsScreen')}>
          <MaterialIcons name="notifications" size={28} color="#5E35B1" />
          {notificationCount > 0 && <View style={styles.badgeModern}><Text style={styles.badgeTextModern}>{notificationCount > 9 ? '9+' : notificationCount}</Text></View>}
        </TouchableOpacity>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.promoBannerContainer}>
          <LinearGradient colors={['#5E35B1', '#7C4DFF']} style={styles.promoBanner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.promoText}>30% OFF on First 5 Orders!</Text>
            <Text style={styles.promoCode}>Use code: LAUNCH30</Text>
            <TouchableOpacity style={styles.promoButton} activeOpacity={0.85} onPress={() => router.push('/promo/promo-page')}><Text style={styles.promoButtonText}>Claim Offer</Text></TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Our Services</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          <TouchableOpacity style={[ styles.categoryButton, activeCategory === 'All' && styles.activeCategory, ]} activeOpacity={0.7} onPress={() => setActiveCategory('All')}>
            <MaterialCommunityIcons name="apps" size={18} color={activeCategory === 'All' ? '#fff' : '#5E35B1'} style={{ marginRight: 7 }} />
            <Text style={[ styles.categoryText, activeCategory === 'All' && styles.activeCategoryText ]}>All</Text>
          </TouchableOpacity>
          {services.map(service => (
            <TouchableOpacity key={service.category} style={[ styles.categoryButton, activeCategory === service.category && styles.activeCategory, ]} activeOpacity={0.7} onPress={() => setActiveCategory(service.category)}>
              <MaterialCommunityIcons name={service.iconName} size={18} color={activeCategory === service.category ? '#fff' : '#5E35B1'} style={{ marginRight: 7 }} />
              <Text style={[ styles.categoryText, activeCategory === service.category && styles.activeCategoryText ]}>{service.category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.servicesGrid}
          columnWrapperStyle={styles.servicesRow}
        />

        {/* --- 3. Conditionally render the Order Summary Card only if cart has items --- */}
        {totalItemsCount > 0 && (
          <TouchableOpacity style={styles.orderSummaryCard} onPress={() => router.push('/order/order-summary')}>
            <Text style={styles.orderSummaryTitle}>Current Order</Text>
            
            {/* This part is now dynamic, based on the cart's contents */}
            <View style={styles.orderItemRow}>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {`${totalItemsCount} item${totalItemsCount > 1 ? 's' : ''} in your order`}
              </Text>
            </View>

            <View style={styles.summaryRowMini}>
              <Text style={styles.summaryLabelMini}>Subtotal</Text>
              <Text style={styles.summaryValueMini}>{formatToKsh(subtotal)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRowMini}>
                <Text style={styles.summaryLabelMini}>Discount</Text>
                <Text style={[styles.summaryValueMini, styles.discountValue]}>-{formatToKsh(discount)}</Text>
              </View>
            )}
            <View style={styles.summaryRowMini}>
              <Text style={styles.summaryLabelMini}>Total</Text>
              <Text style={styles.totalValueMini}>{formatToKsh(total)}</Text>
            </View>
            
            {/* The payment method part is removed as it's not part of cart data */}

            <View style={styles.viewFullSummary}>
              <Text style={styles.viewFullText}>View Full Summary</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#5E35B1" />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          {activeOrders.length > 0 && <TouchableOpacity onPress={() => router.push('/orders/history')}><Text style={styles.seeAll}>View All</Text></TouchableOpacity>}
        </View>
        {activeOrders.length > 0 ? (
          <FlatList
            data={activeOrders.slice(0, 2)}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.activeOrderCard} activeOpacity={0.8} onPress={() => router.push(`/orders/${item.id}`)}>
                <View style={styles.activeOrderIconContainer}><MaterialCommunityIcons name={item.icon} size={28} color="#5E35B1" /></View>
                <View style={styles.activeOrderInfo}>
                  <Text style={styles.activeOrderServiceType}>{item.serviceType} - {item.items} items</Text>
                  <Text style={styles.activeOrderId}>ID: {item.id}</Text>
                  <View style={styles.activeOrderStatusRow}><View style={[styles.statusIndicator, { backgroundColor: item.statusColor }]} /><Text style={[styles.activeOrderStatus, { color: item.statusColor }]}>{item.status}</Text></View>
                  <Text style={styles.activeOrderEst}>{item.estimatedCompletion}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#B0BEC5" />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyOrders}>
            <MaterialCommunityIcons name="package-variant-closed" size={54} color="#ccc" />
            <Text style={styles.emptyText}>No active orders</Text>
            <Text style={styles.emptySubText}>Your ongoing orders will appear here.</Text>
            <TouchableOpacity style={styles.orderButton} activeOpacity={0.85} onPress={() => router.push('/order/select-service')}><Text style={styles.orderButtonText}>Place New Order</Text></TouchableOpacity>
          </View>
        )}

        {/* ... Rest of the component remains the same ... */}
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Pickup Schedule</Text><TouchableOpacity onPress={() => router.push('/schedule/schedule1')}><Text style={styles.seeAll}>View Schedule</Text></TouchableOpacity></View>
        <View style={styles.scheduleCard}><View style={styles.scheduleIconBg}><MaterialCommunityIcons name="calendar-check" size={24} color="#4CAF50" /></View><View style={styles.scheduleInfo}><Text style={styles.scheduleTitle}>Next Pickup</Text><Text style={styles.scheduleTime}>Tomorrow, 9:00 AM - 11:00 AM</Text></View><TouchableOpacity style={styles.scheduleButton} activeOpacity={0.85} onPress={() => router.push('/schedule/edit')}><Text style={styles.scheduleButtonText}>Change</Text></TouchableOpacity></View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles remain the same, with minor adjustments to the order summary card ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollViewContent: { paddingBottom: 80 },
  headerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 20, marginBottom: 15, padding: 18, borderRadius: 18, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)', shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 8, overflow: 'hidden' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarIcon: { width: 54, height: 54, borderRadius: 27, marginRight: 14, borderWidth: 2.5, borderColor: '#EDE7F6', backgroundColor: '#EDE7F6', justifyContent: 'center', alignItems: 'center' },
  greetingModern: { fontSize: 17, fontWeight: '500', color: '#333', marginBottom: 2 },
  greetingSub: { fontSize: 13, color: '#888', marginBottom: 2 },
  userName: { color: '#5E35B1', fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationModern: { fontSize: 13, color: '#5E35B1', marginLeft: 3, fontWeight: '500' },
  bellContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center', padding: 8, borderRadius: 22, backgroundColor: 'rgba(94,53,177,0.1)' },
  badgeModern: { position: 'absolute', top: -4, right: -6, backgroundColor: '#FF5722', borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3, zIndex: 1 },
  badgeTextModern: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  promoBannerContainer: { marginHorizontal: 20, marginTop: 20, borderRadius: 15, overflow: 'hidden', shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 6 },
  promoBanner: { padding: 25, alignItems: 'center' },
  promoText: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 6, textAlign: 'center', lineHeight: 26 },
  promoCode: { color: 'rgba(255,255,255,0.95)', fontSize: 15, textAlign: 'center', marginBottom: 15, fontWeight: '500' },
  promoButton: { marginTop: 10, backgroundColor: '#fff', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 25, shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  promoButtonText: { color: '#5E35B1', fontWeight: '700', fontSize: 16, letterSpacing: 0.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 25, marginBottom: 10 },
  sectionTitle: { fontSize: 19, fontWeight: '700', color: '#333' },
  seeAll: { color: '#5E35B1', fontSize: 15, fontWeight: '600' },
  categoriesContainer: { paddingHorizontal: 15, paddingVertical: 10 },
  categoryButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, backgroundColor: '#ECEFF1', marginRight: 10, borderWidth: 1, borderColor: '#CFD8DC', minWidth: 100, justifyContent: 'center' },
  activeCategory: { backgroundColor: '#5E35B1', borderColor: '#5E35B1', shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  categoryText: { color: '#546E7A', fontSize: 15, fontWeight: '600' },
  activeCategoryText: { color: 'white', fontWeight: 'bold' },
  servicesGrid: { paddingHorizontal: 15, paddingBottom: 5 },
  servicesRow: { justifyContent: 'space-between', marginBottom: 15 },
  serviceCard: { width: '48%', aspectRatio: 1, padding: 18, borderRadius: 16, justifyContent: 'space-evenly', alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  serviceCardActive: { shadowOpacity: 0.3, elevation: 8 },
  serviceTitle: { color: 'white', fontSize: 17, fontWeight: '700', textAlign: 'center' },
  serviceDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 12, textAlign: 'center', lineHeight: 16 },
  emptyOrders: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30, paddingHorizontal: 20, marginHorizontal: 20, marginTop: 10 },
  emptyText: { fontSize: 17, fontWeight: '700', color: '#757575', marginTop: 18, textAlign: 'center' },
  emptySubText: { fontSize: 15, color: '#9E9E9E', marginTop: 8, marginBottom: 25, textAlign: 'center' },
  orderButton: { backgroundColor: '#5E35B1', paddingHorizontal: 35, paddingVertical: 14, borderRadius: 28, marginTop: 10, shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  orderButtonText: { color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: 0.7 },
  scheduleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, padding: 20, marginHorizontal: 20, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  scheduleIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginRight: 18 },
  scheduleInfo: { flex: 1 },
  scheduleTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  scheduleTime: { fontSize: 14, color: '#555', marginTop: 5 },
  scheduleButton: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 22, backgroundColor: '#EDE7F6', shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
  scheduleButtonText: { color: '#5E35B1', fontSize: 14, fontWeight: '600' },
  activeOrderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, padding: 18, marginHorizontal: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  activeOrderIconContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EDE7F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  activeOrderInfo: { flex: 1 },
  activeOrderServiceType: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 3 },
  activeOrderId: { fontSize: 12, color: '#757575', marginBottom: 6 },
  activeOrderStatusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  activeOrderStatus: { fontSize: 13, fontWeight: 'bold' },
  activeOrderEst: { fontSize: 13, color: '#555' },
  orderSummaryCard: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginHorizontal: 20, marginTop: 15, marginBottom: 20, shadowColor: '#5E35B1', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  orderSummaryTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
  orderItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  orderItemName: { fontSize: 16, color: '#333', fontWeight: '500', flex: 1, marginRight: 10 },
  summaryRowMini: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingTop: 6 },
  summaryLabelMini: { fontSize: 14, color: '#555' },
  summaryValueMini: { fontSize: 14, fontWeight: '600', color: '#333' },
  totalValueMini: { fontSize: 16, fontWeight: '700', color: '#5E35B1' },
  viewFullSummary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f5f5f5' },
  viewFullText: { color: '#5E35B1', fontWeight: '600', fontSize: 15, marginRight: 5 },
  discountValue: { color: '#4CAF50' },
});

export default HomeScreen;
