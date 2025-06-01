import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter, Stack } from 'expo-router'; // Import useRouter

const SERVICES = [
  {
    key: 'WashAndFold',
    title: 'Wash & Fold',
    desc: 'Regular laundry service',
    icon: 'washing-machine',
    color: '#4CAF50',
    route: '/categories/WashAndFold',
  },
  {
    key: 'DryClean',
    title: 'Dry Clean',
    desc: 'Professional dry cleaning',
    icon: 'hanger',
    color: '#2196F3',
    route: '/categories/DryClean',
  },
  {
    key: 'Ironing',
    title: 'Ironing',
    desc: 'Press only service',
    icon: 'iron-outline',
    color: '#FF9800',
    route: '/categories/Ironing',
  },
  {
    key: 'Premium',
    title: 'Premium',
    desc: 'Delicate & special care',
    icon: 'diamond-stone',
    color: '#9C27B0',
    route: '/categories/Premium',
  },
];

export default function SelectService() {
  const router = useRouter(); // Initialize router

  return (
    <View style={styles.fullContainer}>
      <Stack.Screen options={{ headerShown: false }} /> 
      {/* Premium Glass Header with Back Button */}
      <BlurView
        intensity={90}
        tint="light"
        style={styles.headerContainer}
      >
        <View style={styles.glassCircle} />
        <View style={styles.glassCircle2} />
        
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()} // Direct navigation
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#5E35B1" 
          />
        </TouchableOpacity>
        
        {/* Header Title */}
        <Text style={styles.headerTitle}>Select a Service</Text>
        
        {/* Empty View for spacing */}
        <View style={styles.spacer} />
      </BlurView>

      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {SERVICES.map(service => (
  <TouchableOpacity
    key={service.key}
    style={[styles.card, { backgroundColor: service.color + '15' }]}
    activeOpacity={0.85}
    onPress={() => router.push('/(tabs)')}
  >
    <View style={[styles.iconBg, { backgroundColor: service.color + '33' }]}>
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
    paddingBottom: 20,
    paddingHorizontal: 24,
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
    backgroundColor: 'rgba(148, 108, 230, 0.12)',
    top: -30,
    left: -20,
  },
  glassCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    bottom: -40,
    right: -30,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(94, 53, 177, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.08)',
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: '#2D1155',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  spacer: {
    width: 42,
  },
  container: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
  },
  desc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});