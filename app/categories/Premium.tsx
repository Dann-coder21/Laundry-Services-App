import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BlurView } from 'expo-blur';

import { Colors } from '@/constants/Colors';

// --- Dummy Data for Premium Service Details ---
const serviceDetailsPremium = {
  title: 'Elite Premium Service', // More impactful title
  tagline: 'Unparalleled laundry care tailored to your lifestyle and needs.',
  description: 'Our Elite Premium Service offers an unparalleled laundry and dry cleaning experience, designed for those who demand the best. Beyond standard garment care, we provide a suite of exclusive benefits, cutting-edge features, and personalized attention, ensuring every interaction is seamless and every garment receives bespoke treatment. Elevate your laundry routine with convenience, precision, and luxury.',
  priceIcon: 'currency-usd-circle-outline', // MaterialCommunityIcons icon for custom pricing
  serviceColor: '#9C27B0', // This is the deep purple color from your HomeScreen services
};

// --- Detailed Premium Features ---
const premiumFeatures = [
  {
    category: 'User Convenience & Personalization',
    categoryIcon: 'account-cog-outline', // Icon for the category
    items: [
      { name: 'Express Delivery', description: 'Same-day or next-day service for urgent laundry needs, ensuring your items are back when you need them most.', icon: 'truck-fast-outline' },
      { name: 'Scheduled Pickup & Delivery', description: 'Precisely select your preferred time slots for pickups and drop-offs, fitting perfectly into your busy schedule.', icon: 'calendar-sync-outline' },
      { name: 'Recurring Orders', description: 'Auto-schedule weekly or biweekly laundry pickups, so you never have to think about placing an order again.', icon: 'repeat-variant' },
      { name: 'Custom Wash Preferences', description: 'Save your exact preferences: detergent type, water temperature, folding style, fabric softeners, or even specific fragrance levels for a truly personalized wash.', icon: 'cog-outline' },
      { name: 'Favorite Items Tagging', description: 'Easily mark certain items (like uniforms, delicate lingerie, or baby clothes) for special attention or recurring specialized treatment.', icon: 'tag-heart-outline' },
    ]
  },
  {
    category: 'Billing & Rewards',
    categoryIcon: 'credit-card-outline',
    items: [
      { name: 'Laundry Subscriptions', description: 'Unlock monthly plans with significant discounted rates, complimentary pickup/delivery, or priority service tiers for ultimate value.', icon: 'wallet-plus-outline' },
      { name: 'Wallet & Loyalty Points', description: 'Earn exclusive loyalty points with every order, redeemable for discounts on future services or even free premium washes.', icon: 'star-circle-outline' },
      { name: 'Split Payments & Family Accounts', description: 'Manage shared or individual billing for multiple users under one account, ideal for families or shared living arrangements.', icon: 'account-group-outline' },
    ]
  },
  {
    category: 'Service Add-ons',
    categoryIcon: 'plus-box-outline',
    items: [
      { name: 'Garment Tracking', description: 'Enjoy real-time tracking of your laundry\'s journey: from pickup, through processing, and out for delivery on an interactive map.', icon: 'map-marker-path' },
      { name: 'Stain Treatment Requests', description: 'Easily flag items needing special stain removal or specific dry cleaning attention with detailed notes through the app.', icon: 'spray-bottle-outline' },
      { name: 'Eco-Friendly Option', description: 'Opt-in for our biodegradable detergents, cold wash cycles, or water-saving methods to reduce your environmental footprint.', icon: 'leaf-circle-outline' },
      { name: 'Ironing & Folding Options', description: 'Choose your desired finish: precise ironing, gentle steam-pressing, neatly folded, or delivered on hangers, just the way you like.', icon: 'tshirt-crew-outline' },
      { name: 'Shoe & Bag Cleaning', description: 'Extend professional care to your shoes, handbags, and accessories with specialized cleaning techniques to restore their look and feel.', icon: 'shoe-sneaker' },
    ]
  },
  {
    category: 'Premium App Features',
    categoryIcon: 'cellphone-check',
    items: [
      { name: 'Priority Customer Support', description: 'Access dedicated chat or call support with significantly shorter wait times, ensuring immediate assistance when you need it.', icon: 'headset' },
      { name: 'Order History & Insights', description: 'View a comprehensive visual history of all past orders, including average weight, most-used services, and spending trends.', icon: 'chart-box-outline' },
      { name: 'Smart Notifications', description: 'Receive intelligent reminders for recurring orders, personalized special offers, or real-time alerts when your pickup or delivery is nearby.', icon: 'bell-badge-outline' },
      { name: 'Multi-Language & Accessibility Options', description: 'Experience broader access with robust localization and accessible design features, catering to diverse user needs.', icon: 'web' },
    ]
  },
  {
    category: 'Operational Upgrades',
    categoryIcon: 'truck-outline',
    items: [
      { name: 'Live Driver Tracking', description: 'Watch your laundry pickup or delivery driver on a live map, providing peace of mind and accurate arrival estimates.', icon: 'map-marker-distance' },
      { name: 'Secure Contactless Delivery', description: 'Ensure safe and convenient delivery with options for photo confirmation, unique delivery codes, or digital signatures.', icon: 'truck-check-outline' },
    ]
  },
  {
    category: 'Special Perks',
    categoryIcon: 'gift-outline',
    items: [
      { name: 'Free Add-Ons for Premium Members', description: 'Enjoy complimentary premium fabric softener, dryer sheets, specialized packaging upgrades, or garment bags with your orders.', icon: 'star-four-points-outline' },
      { name: 'Seasonal Discounts or First Access', description: 'Gain early access to exclusive sales events, new service launches, and special seasonal promotions before anyone else.', icon: 'brightness-percent' },
    ]
  },
];
// --- End Dummy Data ---

export default function PremiumScreen() {
  const router = useRouter();
  const colorScheme = 'light';
  const primaryColor = serviceDetailsPremium.serviceColor; 

  return (
    <ThemedView style={styles.fullContainer}>
      <Stack.Screen
  options={{
    header: () => (
      <BlurView
        intensity={95}
        tint="light"
        style={{
          paddingTop: Platform.OS === 'ios' ? 50 : 30,
          paddingBottom: 18,
          paddingHorizontal: 22,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          backgroundColor: 'rgba(250, 245, 255, 0.8)', // Lighter background for premium feel
          overflow: 'hidden',
          shadowColor: '#8E44AD', // Purple with a hint of luxury
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 20,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(142, 68, 173, 0.15)', // Deep purple border
        }}
      >
        {/* Premium decorative elements */}
        <View style={[styles.glassCircle, { top: -30, left: -20, backgroundColor: 'rgba(155, 89, 182, 0.15)' }]} />
        <View style={[styles.glassDiamond, { bottom: -40, right: -30, backgroundColor: 'rgba(142, 68, 173, 0.1)' }]} />
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.premiumBackButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#8E44AD" // Deep purple
          />
        </TouchableOpacity>

        {/* Title with Premium Icon */}
        <View style={styles.premiumTitleContainer}>
          <MaterialCommunityIcons 
            name="crown" 
            size={24} 
            color="#8E44AD" 
            style={styles.premiumTitleIcon}
          />
          <ThemedText style={styles.premiumHeaderTitle}>
            Premium Care
          </ThemedText>
        </View>
        
        {/* Premium Action Button */}
        <TouchableOpacity
          style={styles.premiumInfoButton}
          onPress={() => console.log('Premium info pressed')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="diamond-stone" 
            size={24} 
            color="#8E44AD" 
          />
        </TouchableOpacity>
      </BlurView>
    ),
    headerTransparent: true,
    headerShadowVisible: false,
  }}
/>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Hero Section: Icon, Title, and Tagline */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIconBackground, { backgroundColor: `${primaryColor}20` }]}>
            <MaterialCommunityIcons name="diamond-stone" size={60} color={primaryColor} />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>{serviceDetailsPremium.title}</ThemedText>
          <ThemedText style={styles.heroTagline}>{serviceDetailsPremium.tagline}</ThemedText>
        </View>

        {/* About Service Section (Card) */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>About This Service</ThemedText>
          <ThemedText style={styles.descriptionText}>{serviceDetailsPremium.description}</ThemedText>
        </View>

        {/* Dynamic Premium Feature Categories */}
        {premiumFeatures.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.sectionCard}>
            <View style={styles.categoryHeader}>
              <MaterialCommunityIcons name={category.categoryIcon as any} size={24} color={primaryColor} style={styles.categoryIcon} />
              <ThemedText type="subtitle" style={styles.sectionSubtitle}>{category.category}</ThemedText>
            </View>
            <View style={styles.categoryItemsContainer}>
              {category.items.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.featureItemContainer}>
                  <MaterialCommunityIcons name={feature.icon as any} size={24} color={primaryColor} style={styles.featureItemIcon} />
                  <View style={styles.featureItemContent}>
                    <ThemedText style={styles.featureItemTitle}>{feature.name}</ThemedText>
                    <ThemedText style={styles.featureItemDescription}>{feature.description}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Pricing & Custom Quote Section (Card) */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Pricing & Custom Quote</ThemedText>
          <View style={[styles.pricingCard, { backgroundColor: `${primaryColor}20`, borderColor: `${primaryColor}40` }]}>
            <MaterialCommunityIcons name={serviceDetailsPremium.priceIcon as any} size={28} color={primaryColor} />
            <ThemedText style={[styles.pricingText, { color: primaryColor }]}>{serviceDetailsPremium.pricingInfo}</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Button at the bottom */}
      <View style={styles.bottomButtonContainer}>
  <TouchableOpacity 
    style={[styles.orderButton, { backgroundColor: primaryColor, shadowColor: primaryColor }]} 
    activeOpacity={0.8} 
    onPress={() => router.push('/order/premium-order')}
  >
    <ThemedText style={styles.orderButtonText}>Get a Custom Quote</ThemedText>
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
  paddingTop: Platform.OS === 'ios' ? 90 : 70, // Add this line or adjust as needed
  paddingBottom: 100,
  paddingHorizontal: 20,
},
  backButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(94,53,177,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- Hero Section Styles ---
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
  // --- General Section Card Styles ---
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
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#555',
  },
  // --- Category Header (New) ---
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryItemsContainer: {
    // Container for the list of features within a category
  },
  // --- Individual Feature Item Styles (New) ---
  featureItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align icon at top of text
    backgroundColor: '#fff', 
    borderRadius: 12,
    padding: 15,
    marginBottom: 10, // Spacing between features
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1, 
    borderColor: '#eee',
  },
  featureItemIcon: {
    marginRight: 15,
    marginTop: 3, // Align icon better with text start
  },
  featureItemContent: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333', // Dark text for titles
    marginBottom: 4,
  },
  featureItemDescription: {
    fontSize: 13,
    color: '#666', // Muted text for descriptions
    lineHeight: 18,
  },
  // --- Pricing Card Styles ---
  pricingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
  },
  pricingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    lineHeight: 22,
  },
  // --- Sticky Bottom Button Styles ---
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
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

  premiumBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(142, 68, 173, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(142, 68, 173, 0.08)',
    shadowColor: '#8E44AD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  premiumTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 68, 173, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(142, 68, 173, 0.05)',
  },
  premiumTitleIcon: {
    marginRight: 10,
  },
  premiumHeaderTitle: {
    fontWeight: '800', // Extra bold for premium
    fontSize: 18,
    color: '#4A235A', // Deep purple for luxury
    textShadowColor: 'rgba(142, 68, 173, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  premiumInfoButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(142, 68, 173, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(142, 68, 173, 0.05)',
  },
  glassCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  glassDiamond: {
    position: 'absolute',
    width: 70,
    height: 70,
    transform: [{ rotate: '45deg' }],
  },
});