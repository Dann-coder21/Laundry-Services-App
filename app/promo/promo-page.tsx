import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';


export default function PromoScreen() {
  const router = useRouter();
  const scaleValue = new Animated.Value(0.8);
  const rotateValue = new Animated.Value(0);

  React.useEffect(() => {
    // Pulse animation for the promo card
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation for the sale icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateInterpolate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const promos = [
    {
      id: 1,
      title: 'First Order Discount',
      discount: '30% OFF',
      code: 'LAUNCH30',
      description: 'Enjoy 30% off on your first 5 laundry orders',
      icon: 'sale',
      color: '#7C4DFF',
    },
    {
      id: 2,
      title: 'Referral Bonus',
      discount: '$10 CREDIT',
      code: 'FRIEND10',
      description: 'Get $10 credit when you refer a friend',
      icon: 'account-multiple-plus',
      color: '#FF9800',
    },
    {
      id: 3,
      title: 'Bundle Deal',
      discount: '15% OFF',
      code: 'BUNDLE15',
      description: '15% off when you order 3+ services',
      icon: 'package-variant',
      color: '#4CAF50',
    },
  ];

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
          backgroundColor: 'rgba(243, 239, 255, 0.75)',
          overflow: 'hidden',
          shadowColor: '#7C4DFF',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(124, 77, 255, 0.15)',
        }}
      >
        {/* Decorative elements */}
        <View style={[styles.glassCircle, { top: -30, left: -20, backgroundColor: 'rgba(124, 77, 255, 0.12)' }]} />
        <View style={[styles.glassCircle, { bottom: -40, right: -30, backgroundColor: 'rgba(93, 53, 177, 0.08)' }]} />
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.offersBackButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#7C4DFF" 
          />
          
        </TouchableOpacity>

        {/* Title with Icon */}
        <View style={styles.offersTitleContainer}>
          <MaterialCommunityIcons 
            name="sale" 
            size={26} 
            color="#7C4DFF" 
            style={styles.offersTitleIcon}
          />
          <ThemedText style={styles.offersHeaderTitle}>
            Special Offers
          </ThemedText>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => console.log('Filter pressed')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="filter-variant" 
            size={24} 
            color="#7C4DFF" 
          />
        </TouchableOpacity>
      </BlurView>
    ),
    headerTransparent: true,
    headerShadowVisible: false,
  }}
/>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <MaterialCommunityIcons 
              name="sale" 
              size={80} 
              color="#FF5722" 
              style={styles.saleIcon}
            />
          </Animated.View>
          <ThemedText type="title" style={styles.heroTitle}>Exclusive Offers</ThemedText>
          <ThemedText style={styles.heroSubtitle}>Limited-time deals just for you</ThemedText>
        </View>

        {/* Promo Cards */}
        {promos.map((promo) => (
          <Animated.View 
            key={promo.id}
            style={[
              styles.promoCard,
              { 
                borderLeftWidth: 6,
                borderLeftColor: promo.color,
                transform: [{ scale: promo.id === 1 ? scaleValue : 1 }] 
              }
            ]}
          >
            <View style={styles.promoHeader}>
              <MaterialCommunityIcons 
                name={promo.icon} 
                size={32} 
                color={promo.color} 
                style={styles.promoIcon}
              />
              <View>
                <ThemedText style={styles.promoTitle}>{promo.title}</ThemedText>
                <ThemedText style={[styles.promoDiscount, { color: promo.color }]}>
                  {promo.discount}
                </ThemedText>
              </View>
            </View>
            
            <ThemedText style={styles.promoDescription}>{promo.description}</ThemedText>
            
            <View style={styles.codeContainer}>
              <ThemedText style={styles.codeLabel}>Use code:</ThemedText>
              <ThemedText style={[styles.codeText, { color: promo.color }]}>
                {promo.code}
              </ThemedText>
            </View>
          </Animated.View>
        ))}

        {/* Terms & Conditions */}
        <View style={styles.termsCard}>
          <ThemedText style={styles.termsTitle}>Terms & Conditions</ThemedText>
          <ThemedText style={styles.termsText}>
            • Offers valid for new customers only{'\n'}
            • One promo code per order{'\n'}
            • Cannot be combined with other offers{'\n'}
            • Valid until December 31, 2023
          </ThemedText>
        </View>
      </ScrollView>

      {/* Sticky Button */}
      <LinearGradient
        colors={['#5E35B1', '#7C4DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonContainer}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/promo/promo-chekout')}
        >
          <ThemedText style={styles.buttonText}>Start Saving Now</ThemedText>
          <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
  paddingTop: Platform.OS === 'ios' ? 90 : 70, // Add this line
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
  saleIcon: {
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  promoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  promoIcon: {
    marginRight: 15,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  promoDiscount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 3,
  },
  promoDescription: {
    fontSize: 15,
    color: '#555',
    marginBottom: 15,
    lineHeight: 22,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  termsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  offersBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 77, 255, 0.12)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.08)',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  offersBackText: {
    color: '#7C4DFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
  },
  offersTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 77, 255, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.05)',
  },
  offersTitleIcon: {
    marginRight: 10,
  },
  offersHeaderTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: '#4527A0', // Deep purple
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(124, 77, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.05)',
  },
  glassCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});