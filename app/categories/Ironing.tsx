import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';


const serviceDetails = {
  title: 'Professional Ironing',
  tagline: 'Crisp, wrinkle-free garments with expert pressing.',
  description: 'Our premium ironing service delivers perfectly pressed clothes every time. Using professional-grade steam irons and specialized techniques, we handle all fabric types with care. From dress shirts to delicate silks, your garments will look freshly pressed and ready to wear.',
  features: [
    { icon: 'iron', text: 'Professional pressing' },
    { icon: 'steam', text: 'High-quality steam' },
    { icon: 'tshirt-crew', text: 'All fabric types' },
    { icon: 'clock-fast', text: 'Express service' },
    { icon: 'shield-check', text: 'Quality guarantee' },
    { icon: 'home-edit', text: 'Ready-to-wear' },
  ],
  pricingInfo: 'Starting at $2.50 per item. Bulk discounts available for 10+ items. Special items like suits or dresses priced separately.',
  priceIcon: 'currency-usd',
};

export default function IroningScreen() {
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
        style={{
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
        }}
      >
        {/* Decorative elements */}
        <View style={[styles.glassCircle, { top: -30, left: -20, backgroundColor: 'rgba(148, 108, 230, 0.12)' }]} />
        <View style={[styles.glassCircle, { bottom: -40, right: -30, backgroundColor: 'rgba(94, 53, 177, 0.08)' }]} />
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.ironingBackButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#5E35B1" 
          />
        </TouchableOpacity>

        {/* Title with Icon */}
        <View style={styles.ironingTitleContainer}>
          <MaterialCommunityIcons 
            name="iron" 
            size={24} 
            color="#5E35B1" 
            style={styles.ironingTitleIcon}
          />
          <ThemedText style={styles.ironingHeaderTitle}>
            Ironing Service
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

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIconBackground, { backgroundColor: `${primaryColor}20` }]}>
            <MaterialCommunityIcons name="iron" size={60} color={primaryColor} />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>{serviceDetails.title}</ThemedText>
          <ThemedText style={styles.heroTagline}>{serviceDetails.tagline}</ThemedText>
        </View>

        {/* About Service Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>About This Service</ThemedText>
          <ThemedText style={styles.descriptionText}>{serviceDetails.description}</ThemedText>
        </View>

        {/* Key Features Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Key Features</ThemedText>
          <View style={styles.featuresGrid}>
            {serviceDetails.features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <MaterialCommunityIcons name={feature.icon} size={26} color={primaryColor} />
                <ThemedText style={styles.featureText}>{feature.text}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Pricing</ThemedText>
          <View style={styles.pricingCard}>
            <MaterialCommunityIcons name={serviceDetails.priceIcon} size={28} color={primaryColor} />
            <ThemedText style={styles.pricingText}>{serviceDetails.pricingInfo}</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Order Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[styles.orderButton, { backgroundColor: primaryColor }]}
          activeOpacity={0.8}
          onPress={() => router.push('/order/OrderIroning')}
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
    paddingTop: 0,
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
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#555',
  },
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
ironingBackButton: {
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
  ironingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
  },
  ironingTitleIcon: {
    marginRight: 10,
  },
  ironingHeaderTitle: {
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
  glassCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});