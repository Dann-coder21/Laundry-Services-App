import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform, Image, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';

const PremiumOrderScreen = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('elite');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const primaryColor = '#9C27B0';
  const secondaryColor = '#FF9800';

  const plans = [
    {
      id: 'elite',
      name: 'Elite Membership',
      price: 'Ksh 13,000/month',
      features: [
        'Unlimited express service',
        'Premium fabric care',
        'Priority scheduling',
        '5 free add-ons monthly'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plus',
      price: 'Ksh 9,000/month',
      features: [
        '15 items weekly',
        'Standard express service',
        '3 free add-ons monthly'
      ]
    },
    {
      id: 'basic',
      name: 'Essential Care',
      price: 'Ksh 6,500/month',
      features: [
        '10 items weekly',
        'Basic care',
        '1 free add-on monthly'
      ]
    }
  ];

  const addons = [
    { 
      id: 'stain', 
      name: 'Advanced Stain Treatment', 
      price: '+Ksh 650', 
      icon: 'spray-bottle',
      description: 'Professional treatment for tough stains using specialized solutions.',
      benefits: [
        'Removes even set-in stains',
        'Safe for most fabrics',
        'Pre-treatment included'
      ]
    },
    { 
      id: 'eco', 
      name: 'Eco Detergent Upgrade', 
      price: '+Ksh 400', 
      icon: 'leaf',
      description: 'Environmentally friendly cleaning with plant-based detergents.',
      benefits: [
        'Hypoallergenic formula',
        'Biodegradable ingredients',
        'Gentle on sensitive skin'
      ]
    },
    { 
      id: 'handwash',
      name: 'Hand Wash Special',
      price: '+Ksh 1,000',
      icon: 'hand-water',
      description: 'Gentle hand washing for delicate fabrics (silk, wool, lingerie) using mild detergents and cold water to prevent damage.',
      benefits: [
        'Prevents shrinkage and fabric damage',
        'Special pH-neutral detergents',
        'Individual attention to each garment',
        'Preserves colors and textures',
        'Ideal for luxury fabrics'
      ]
    },
    { 
      id: 'steam',
      name: 'Professional Steam Press',
      price: '+Ksh 900', 
      icon: 'steam',
      description: 'Advanced steam finishing that removes deep wrinkles while sanitizing fabrics without harsh pressing.',
      benefits: [
        'Eliminates 99.9% of bacteria',
        'No shine or fabric compression',
        'Perfect for suits and formalwear',
        'Odor removal without chemicals',
        'Preserves garment structure'
      ]
    },
    { 
      id: 'storage', 
      name: '1 Month Storage', 
      price: '+Ksh 2,000', 
      icon: 'wardrobe',
      description: 'Climate-controlled storage for seasonal items with protective packaging.',
      benefits: [
        'Dust-free environment',
        'Moth prevention',
        'Garment bags included'
      ]
    }
  ];

  const toggleAddon = (addonId) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const calculateTotal = () => {
    const planPrice = selectedPlan === 'elite' ? 13000 : selectedPlan === 'premium' ? 9000 : 6500;
    const addonPrices = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + parseInt(addon.price.replace('+Ksh ', '').replace(',', ''), 10);
    }, 0);
    return planPrice + addonPrices;
  };

  return (
    <ThemedView style={styles.container}>
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
                  Premium Enrollment
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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Premium Badge */}
        <View style={styles.premiumBadge}>
          <MaterialCommunityIcons name="crown" size={20} color="#FFD700" />
          <ThemedText style={styles.premiumBadgeText}>PREMIUM SERVICE</ThemedText>
        </View>

        {/* Header */}
        <ThemedText type="title" style={styles.header}>Customize Your Premium Plan</ThemedText>
        <ThemedText style={styles.subHeader}>Select your membership level and additional services</ThemedText>

        {/* Plan Selection */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Choose Your Plan</ThemedText>
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlanCard,
                selectedPlan === plan.id && { borderColor: primaryColor }
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planHeader}>
                <View style={styles.planRadio}>
                  {selectedPlan === plan.id && (
                    <View style={[styles.planRadioInner, { backgroundColor: primaryColor }]} />
                  )}
                </View>
                <ThemedText style={styles.planName}>{plan.name}</ThemedText>
              </View>
              <ThemedText style={styles.planPrice}>{plan.price}</ThemedText>
              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                    <ThemedText style={styles.featureText}>{feature}</ThemedText>
                  </View>
                ))}
              </View>
              {selectedPlan === plan.id && (
                <LinearGradient
                  colors={['transparent', `${primaryColor}20`]}
                  style={styles.planHighlight}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Schedule */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Delivery Preferences</ThemedText>
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryRow}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color={primaryColor} />
            <View style={styles.deliveryInfo}>
              <ThemedText style={styles.deliveryLabel}>First Pickup Date</ThemedText>
              <TouchableOpacity onPress={showDatepicker}>
                <ThemedText style={styles.deliveryValue}>
                  {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.deliveryRow}>
            <MaterialCommunityIcons name="note-text-outline" size={24} color={primaryColor} />
            <View style={styles.deliveryInfo}>
              <ThemedText style={styles.deliveryLabel}>Delivery Notes</ThemedText>
              <TextInput
                style={styles.notesInput}
                placeholder="Special instructions for our team"
                value={deliveryNotes}
                onChangeText={setDeliveryNotes}
                multiline
              />
            </View>
          </View>
        </View>

        {/* Add-on Services */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Premium Add-ons</ThemedText>
        <View style={styles.addonsContainer}>
          {addons.map((addon) => (
            <TouchableOpacity
              key={addon.id}
              style={[
                styles.addonCard,
                selectedAddons.includes(addon.id) && styles.selectedAddonCard,
                selectedAddons.includes(addon.id) && { borderColor: primaryColor }
              ]}
              onPress={() => toggleAddon(addon.id)}
            >
              <View style={styles.addonHeader}>
                <MaterialCommunityIcons 
                  name={addon.icon} 
                  size={28} 
                  color={selectedAddons.includes(addon.id) ? primaryColor : '#666'} 
                />
                <View style={styles.addonTextContainer}>
                  <ThemedText style={styles.addonName}>{addon.name}</ThemedText>
                  <ThemedText style={styles.addonPrice}>{addon.price}</ThemedText>
                </View>
                {selectedAddons.includes(addon.id) ? (
                  <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color={primaryColor} />
                ) : (
                  <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={24} color="#ddd" />
                )}
              </View>
              
              {selectedAddons.includes(addon.id) && (
                <View style={styles.addonDetails}>
                  <ThemedText style={styles.addonDescription}>{addon.description}</ThemedText>
                  
                  <View style={styles.benefitsContainer}>
                    {addon.benefits.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <MaterialCommunityIcons name="check" size={16} color="#4CAF50" />
                        <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Payment Method</ThemedText>
        <View style={styles.paymentCard}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            style={styles.picker}
            dropdownIconColor={primaryColor}
          >
            <Picker.Item label="Credit/Debit Card" value="credit_card" />
            <Picker.Item label="PayPal" value="paypal" />
            <Picker.Item label="Apple Pay" value="apple_pay" />
            <Picker.Item label="Google Pay" value="google_pay" />
          </Picker>
        </View>

        {/* Summary */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Order Summary</ThemedText>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Selected Plan:</ThemedText>
            <ThemedText style={styles.summaryValue}>
              {plans.find(p => p.id === selectedPlan).name}
            </ThemedText>
          </View>
          
          {selectedAddons.length > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Add-ons:</ThemedText>
              <View style={styles.addonsList}>
                {selectedAddons.map(addonId => {
                  const addon = addons.find(a => a.id === addonId);
                  return (
                    <ThemedText key={addonId} style={styles.summaryValue}>
                      {addon.name} {addon.price}
                    </ThemedText>
                  );
                })}
              </View>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryTotalLabel}>Total:</ThemedText>
            <ThemedText style={styles.summaryTotalValue}>Ksh {calculateTotal().toLocaleString()}/month</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Order Button */}
      <LinearGradient
        colors={[primaryColor, secondaryColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.orderButtonContainer}
      >
        <TouchableOpacity 
          style={styles.orderButton}
          onPress={() => console.log('Order placed')}
        >
          <ThemedText style={styles.orderButtonText}>Complete Enrollment</ThemedText>
          <ThemedText style={styles.orderButtonSubtext}>Ksh {calculateTotal().toLocaleString()}/month</ThemedText>
          <MaterialCommunityIcons name="lock" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  scrollContainer: {
    paddingBottom: 120,
    paddingHorizontal: 20,
    // Add extra padding at the top to account for the custom header
    paddingTop: Platform.OS === 'ios' ? 140 : 120
  },
  backButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 5
  },
  premiumBadgeText: {
    color: '#9C27B0',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 5
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333'
  },
  plansContainer: {
    marginBottom: 25
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#eee',
    overflow: 'hidden'
  },
  selectedPlanCard: {
    borderWidth: 2
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  planRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  planPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 15
  },
  planFeatures: {
    marginLeft: 5
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8
  },
  planHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  },
  deliveryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25
  },
  deliveryRow: {
    flexDirection: 'row',
    marginBottom: 20
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 15
  },
  deliveryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3
  },
  deliveryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14
  },
  addonsContainer: {
    marginBottom: 25
  },
  addonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  selectedAddonCard: {
    borderWidth: 2
  },
  addonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  addonTextContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10
  },
  addonName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3
  },
  addonPrice: {
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '600'
  },
  addonDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  addonDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20
  },
  benefitsContainer: {
    marginLeft: 5
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  benefitText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 8,
    flexShrink: 1
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 25,
    overflow: 'hidden'
  },
  picker: {
    height: 50
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    width: 100
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1
  },
  addonsList: {
    flex: 1
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15
  },
  summaryTotalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    width: 100
  },
  summaryTotalValue: {
    fontSize: 18,
    color: '#9C27B0',
    fontWeight: 'bold',
    flex: 1
  },
  orderButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10
  },
  orderButtonSubtext: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10
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

export default PremiumOrderScreen;