import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';

// --- Dummy Data for Dry Clean Service Details ---
const serviceDetails = {
  title: 'Professional Dry Cleaning',
  tagline: 'Expert care for your delicate and special garments.',
  description: 'Our professional dry cleaning service uses state-of-the-art technology and eco-friendly solvents to clean your delicate garments without water. We handle everything from delicate silks to tailored suits with the utmost care, removing tough stains while preserving fabric integrity. Each item is individually inspected, treated, and pressed to perfection, ensuring your clothes look their best and last longer.',
  features: [
    { icon: 'silverware-fork-knife', text: 'Stain removal' },
    { icon: 'tshirt-crew-outline', text: 'Gentle on delicate fabrics' },
    { icon: 'water-outline', text: 'Eco-friendly solvents' },
    { icon: 'iron', text: 'Professional pressing' },
    { icon: 'shield-check', text: 'Quality inspection' },
    { icon: 'hanger', text: 'Premium garment bags' },
  ],
  pricingInfo: 'Priced per item starting at $5.99. Special pricing for suits ($12.99) and dresses ($9.99). Volume discounts available for 5+ items.',
  priceIcon: 'tag-outline', // MaterialCommunityIcons icon name
  benefits: [
    "Preserves fabric quality and color",
    "Removes tough stains safely",
    "Eco-friendly cleaning process",
    "Professional pressing included",
    "24-48 hour turnaround available"
  ]
};
// --- End Dummy Data ---

export default function DryCleanScreen() {
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
          style={styles.dryCleanBackButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#5E35B1" 
          />
        </TouchableOpacity>

        {/* Title with Icon */}
        <View style={styles.dryCleanTitleContainer}>
          <MaterialCommunityIcons 
            name="hanger" 
            size={24} 
            color="#5E35B1" 
            style={styles.dryCleanTitleIcon}
          />
          <ThemedText style={styles.dryCleanHeaderTitle}>
            Dry Clean
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
          <View style={styles.heroIconBackground}>
            <MaterialCommunityIcons name="hanger" size={60} color={primaryColor} />
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

        {/* Benefits Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Why Choose Our Dry Cleaning?</ThemedText>
          <View style={styles.benefitsList}>
            {serviceDetails.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={20} 
                  color="#4CAF50" 
                  style={styles.benefitIcon} 
                />
                <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing & How it Works Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Pricing & How it Works</ThemedText>
          <View style={styles.pricingCard}>
            <MaterialCommunityIcons name={serviceDetails.priceIcon} size={28} color={primaryColor} />
            <ThemedText style={styles.pricingText}>{serviceDetails.pricingInfo}</ThemedText>
          </View>
          
          <View style={styles.processSteps}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>1</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>Schedule pickup or drop off items</ThemedText>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>2</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>We clean and inspect each item</ThemedText>
            </View>
            
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>3</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>Items returned fresh and pressed</ThemedText>
            </View>
          </View>
        </View>

        {/* Common Items Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionSubtitle}>Common Dry Cleaning Items</ThemedText>
          <View style={styles.itemsGrid}>
            <View style={styles.itemCard}>
              <MaterialCommunityIcons name="tshirt-crew" size={30} color="#5E35B1" />
              <ThemedText style={styles.itemText}>Dress Shirts</ThemedText>
            </View>
            <View style={styles.itemCard}>
              <MaterialCommunityIcons name="account-tie" size={30} color="#5E35B1" />
              <ThemedText style={styles.itemText}>Suits</ThemedText>
            </View>
            <View style={styles.itemCard}>
              <MaterialCommunityIcons name="dresser" size={30} color="#5E35B1" />
              <ThemedText style={styles.itemText}>Dresses</ThemedText>
            </View>
            <View style={styles.itemCard}>
              <MaterialCommunityIcons name="curtains" size={30} color="#5E35B1" />
              <ThemedText style={styles.itemText}>Curtains</ThemedText>
            </View>
            <View style={styles.itemCard}>
              <MaterialCommunityIcons name="blanket" size={30} color="#5E35B1" />
              <ThemedText style={styles.itemText}>Blankets</ThemedText>
            </View>
            <View style={styles.itemCard}>
              <MaterialCommunityIcons name="coat-rack" size={30} color="#5E35B1" />
              <ThemedText style={styles.itemText}>Coats</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.orderButton} 
          activeOpacity={0.8} 
          onPress={() => router.push('/order/OrderDryClean')}
        >
          <ThemedText style={styles.orderButtonText}>Order Dry Cleaning</ThemedText>
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
  benefitsList: {
    marginTop: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    marginRight: 10,
  },
  benefitText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  pricingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D4ECC6',
    marginBottom: 20,
  },
  pricingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    color: '#4CAF50',
    lineHeight: 22,
  },
  processSteps: {
    marginTop: 10,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5E35B1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepText: {
    fontSize: 15,
    color: '#555',
    flex: 1,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5E35B1',
    marginTop: 8,
    textAlign: 'center',
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
dryCleanBackButton: {
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
  dryCleanTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
  },
  dryCleanTitleIcon: {
    marginRight: 10,
  },
  dryCleanHeaderTitle: {
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