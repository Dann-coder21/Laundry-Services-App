import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type PaymentMethod = {
  id: string;
  type: 'mpesa' | 'card' | 'paypal' | 'other';
  name: string;
  details: string;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  isDefault?: boolean;
  color: string;
  gradient: string[];
};

const mockPaymentMethodsData: PaymentMethod[] = [
  { 
    id: '1', 
    type: 'mpesa', 
    name: 'M-Pesa', 
    details: '0712 345 678', 
    iconName: 'cellphone', 
    isDefault: true,
    color: '#4CAF50',
    gradient: ['#4CAF50', '#8BC34A']
  },
  { 
    id: '2', 
    type: 'card', 
    name: 'Visa Card', 
    details: '•••• 4321', 
    iconName: 'credit-card', 
    color: '#2196F3',
    gradient: ['#2196F3', '#64B5F6']
  },
  { 
    id: '3', 
    type: 'card', 
    name: 'Mastercard', 
    details: '•••• 9876', 
    iconName: 'credit-card-multiple', 
    color: '#FF9800',
    gradient: ['#FF9800', '#FFC107']
  },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const colorScheme = 'light';
  const primaryColor = Colors[colorScheme].tint;
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = Platform.OS === 'ios' ? 110 : 90;

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethodsData);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(
    mockPaymentMethodsData.find(m => m.isDefault)?.id || null
  );

  const handleSelectMethod = (id: string) => {
    setSelectedMethodId(id);
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity
      style={[
        styles.paymentMethodItem,
        selectedMethodId === item.id && styles.paymentMethodItemSelected
      ]}
      onPress={() => handleSelectMethod(item.id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={selectedMethodId === item.id ? item.gradient : ['#f5f5f5', '#f5f5f5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.methodCard}
      >
        <View style={styles.methodHeader}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={item.iconName}
              size={24}
              color={selectedMethodId === item.id ? 'white' : item.color}
            />
          </View>
          <View style={styles.radioButton}>
            {selectedMethodId === item.id ? (
              <MaterialIcons name="radio-button-checked" size={24} color="white" />
            ) : (
              <MaterialIcons name="radio-button-unchecked" size={24} color="#ccc" />
            )}
          </View>
        </View>
        
        <View style={styles.methodInfo}>
          <Text style={[styles.methodName, selectedMethodId === item.id && { color: 'white' }]}>
            {item.name}
          </Text>
          <Text style={[styles.methodDetails, selectedMethodId === item.id && { color: 'rgba(255,255,255,0.8)' }]}>
            {item.details}
          </Text>
        </View>
        
        {item.isDefault && !(selectedMethodId === item.id) && (
          <View style={styles.defaultTag}>
            <Text style={styles.defaultTagText}>Default</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.fullContainer}>
      <Stack.Screen
        options={{
          header: () => (
            <BlurView intensity={90} tint="light" style={[styles.glassHeader, { height: HEADER_HEIGHT }]}>
              <View style={[styles.glassCircle, styles.glassCircleTop]} />
              <View style={[styles.glassCircle, styles.glassCircleBottom]} />
              <TouchableOpacity onPress={() => router.back()} style={styles.glassBackButton} activeOpacity={0.8}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={primaryColor} />
              </TouchableOpacity>
              <Text style={styles.glassHeaderTitle}>Payment Methods</Text>
              <View style={{ width: 42 }} />
            </BlurView>
          ),
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollViewContent, { paddingTop: HEADER_HEIGHT + 20, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <Text style={styles.sectionSubtitle}>Your Payment Methods</Text>
          {paymentMethods.length > 0 ? (
            <FlatList
              data={paymentMethods}
              renderItem={renderPaymentMethod}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.methodsList}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons name="credit-card-off-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No payment methods saved</Text>
              <Text style={styles.emptyStateSubText}>Add a payment method to get started</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.addMethodButton}
            activeOpacity={0.8}
            onPress={() => router.push('/(modals)/add-payment-method')}
          >
            <LinearGradient
              colors={[primaryColor, '#7C4DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addButtonGradient}
            >
              <MaterialCommunityIcons name="plus" size={22} color="white" />
              <Text style={styles.addMethodButtonText}>Add New Method</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  glassHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 18,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 243, 255, 0.75)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94, 53, 177, 0.1)',
    overflow: 'hidden',
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
  },
  glassHeaderTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2D1155',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  methodsList: {
    gap: 15,
  },
  paymentMethodItem: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  paymentMethodItemSelected: {
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  methodCard: {
    padding: 20,
    borderRadius: 15,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    marginBottom: 5,
  },
  methodName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  methodDetails: {
    fontSize: 14,
    color: '#666',
  },
  defaultTag: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  defaultTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  bottomActions: {
    marginTop: 10,
  },
  addMethodButton: {
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 15,
  },
  addMethodButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});