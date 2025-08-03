import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter, Stack } from 'expo-router';

// --- Type definition for a service object ---
interface Service {
  key: string;
  title: string;
  desc: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
  route: string; // The specific path to navigate to
}

// --- Service data with correct routes ---
const SERVICES: Service[] = [
  { key: 'WashAndFold', title: 'Wash & Fold', desc: 'Regular laundry by weight', icon: 'washing-machine', color: '#4CAF50', route: '/order/OrderWashAndFold' },
  { key: 'DryClean', title: 'Dry Clean', desc: 'Professional garment cleaning', icon: 'hanger', color: '#2196F3', route: '/order/OrderDryClean' },
  { key: 'Ironing', title: 'Ironing', desc: 'Press only service', icon: 'iron-outline', color: '#FF9800', route: '/order/OrderIroning' },
  { key: 'Premium', title: 'Premium', desc: 'Delicate & special care', icon: 'diamond-stone', color: '#9C27B0', route: '/order/premium-order' },
];

export default function SelectService() {
  const router = useRouter();
  const primaryColor = '#5E35B1'; // Define a primary color for the header

  return (
    <View style={styles.fullContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* --- MODIFIED: Header structure now matches the other improved pages --- */}
      <BlurView
        intensity={90}
        tint="light"
        style={styles.headerContainer}
      >
        <View style={[styles.glassCircle, { backgroundColor: `${primaryColor}15` }]} />
        <View style={[styles.glassCircle2, { backgroundColor: `${primaryColor}10` }]} />
        
        {/* Left-side Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.glassBackButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color={primaryColor} 
          />
        </TouchableOpacity>
        
        {/* Centered Title Container */}
        <View style={styles.glassTitleContainer}>
          <View style={[styles.serviceIconPreview, { backgroundColor: primaryColor }]}>
            <MaterialCommunityIcons
              name="format-list-bulleted-type" // A generic icon for "select"
              size={20}
              color="white"
            />
          </View>
          <Text style={styles.glassHeaderTitle}>Select a Service</Text>
        </View>

        {/* Right-side spacer to balance the layout */}
        <View style={styles.headerSpacer} />
      </BlurView>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {SERVICES.map(service => (
          <TouchableOpacity
            key={service.key}
            style={[styles.card, { backgroundColor: `${service.color}1A`, borderColor: `${service.color}30` }]}
            activeOpacity={0.85}
            onPress={() => router.push(service.route as any)}
          >
            <View style={[styles.iconBg, { backgroundColor: `${service.color}33` }]}>
              <MaterialCommunityIcons name={service.icon} size={36} color={service.color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.desc}>{service.desc}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#bbb" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
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
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -30,
    left: -20,
  },
  glassCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    bottom: -40,
    right: -30,
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
  glassTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
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
  glassHeaderTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2D1155',
  },
  headerSpacer: {
    width: 42, // Same width as the back button to ensure title is centered
  },
  container: {
    padding: 24,
    paddingTop: 30, // Extra space from the taller header
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    transform: [{ scale: 1 }],
    
  },
  iconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  desc: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
    lineHeight: 20,
  },
});

