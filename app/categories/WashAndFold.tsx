import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';

// Calculate header height based on platform
const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

// --- Dummy Data for Wash & Fold Service Details ---
const serviceDetails = {
  title: 'Wash & Fold Laundry',
  tagline: 'Your everyday essentials, expertly cleaned and neatly folded.',
  description: 'Our premium Wash & Fold service handles your daily essentials with utmost care. We utilize advanced, eco-friendly washing techniques and high-quality, hypoallergenic detergents that are gentle on fabrics but tough on stains. Each item is meticulously dried using low-heat settings to protect garments, then neatly folded, and packaged, ensuring they are returned fresh, clean, and ready to put away. Perfect for busy individuals and families looking for convenience and quality.',
  features: [
    { icon: 'leaf', text: 'Eco-friendly detergents' },
    { icon: 'water', text: 'Gentle on fabrics' },
    { icon: 'tshirt-crew', text: 'Machine wash & dry' },
    { icon: 'package-variant', text: 'Neatly folded & packed' },
    { icon: 'timer-sand', text: 'Quick turnaround' },
    { icon: 'star-outline', text: 'Premium quality care' },
  ],
  pricingInfo: 'Billed by weight, starting at $1.50/lb. Minimum 5 lbs per order. Special items like blankets or comforters are priced separately. View detailed pricing for more information.',
  priceIcon: 'weight-kilogram', // MaterialCommunityIcons icon name
};
// --- End Dummy Data ---

export default function WashAndFoldScreen() {
  const router = useRouter();
  const colorScheme = 'light';
  const primaryColor = Colors[colorScheme].tint;

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
              {/* Decorative elements */}
              <View style={[styles.glassCircle, styles.glassCircleTop]} />
              <View style={[styles.glassCircle, styles.glassCircleBottom]} />
              
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.washBackButton}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons 
                  name="arrow-left" 
                  size={24} 
                  color="#5E35B1" 
                />
              </TouchableOpacity>

              {/* Title with Icon */}
              <View style={styles.washTitleContainer}>
                <MaterialCommunityIcons 
                  name="tshirt-crew" 
                  size={24} 
                  color="#5E35B1" 
                  style={styles.washTitleIcon}
                />
                <ThemedText style={styles.washHeaderTitle}>
                  Wash & Fold
                </ThemedText>
              </View>
              
              {/* Action Button */}
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => console.log('Info pressed')}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons 
                  name="information-outline" 
                  size={24} 
                  color="#5E35B1" 
                />
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
          { paddingTop: HEADER_HEIGHT + 20 } // Add header height + extra padding
        ]}
      >
        {/* Hero Section: Icon, Title, and Tagline */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconBackground}>
            <MaterialCommunityIcons name="washing-machine" size={60} color={primaryColor} />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>{serviceDetails.title}</ThemedText>
          <ThemedText style={styles.heroTagline}>{serviceDetails.tagline}</ThemedText>
        </View>

        {/* About Service Section (Card) */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>About This Service</ThemedText>
          <ThemedText style={styles.descriptionText}>{serviceDetails.description}</ThemedText>
        </View>

        {/* Key Features Section (Card with Grid) */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Key Features</ThemedText>
          <View style={styles.featuresGrid}>
            {serviceDetails.features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <MaterialCommunityIcons name={feature.icon as any} size={26} color={primaryColor} />
                <ThemedText style={styles.featureText}>{feature.text}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing & How it Works Section (Card) */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Pricing & How it Works</ThemedText>
          <View style={styles.pricingCard}>
            <MaterialCommunityIcons name={serviceDetails.priceIcon as any} size={28} color={primaryColor} />
            <ThemedText style={styles.pricingText}>{serviceDetails.pricingInfo}</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Button at the bottom */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.orderButton}
          activeOpacity={0.8}
          onPress={() => router.push('/order/OrderWashAndFold')}
        >
          <ThemedText style={styles.orderButtonText}>Proceed to Order</ThemedText>
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
    paddingBottom: 100,
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
  washBackButton: {
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
  washTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
  },
  washTitleIcon: {
    marginRight: 10,
  },
  washHeaderTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2D1155',
  },
  infoButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
  },
  // --- Hero Section Styles ---
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 10,
  },
  heroIconBackground: {
    backgroundColor: '#EDE7F6',
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
  // --- Features Grid Styles ---
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#F7F4FD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEBF8',
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    color: '#5E35B1',
  },
  // --- Pricing Card Styles ---
  pricingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D4ECC6',
  },
  pricingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    color: '#4CAF50',
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
});