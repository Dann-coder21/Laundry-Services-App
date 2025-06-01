import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';

// --- Dummy Data for Pickup Schedule ---
const upcomingPickups = [
  {
    id: 'up1',
    date: 'Tomorrow, Nov 3',
    time: '9:00 AM - 11:00 AM',
    status: 'Confirmed',
    type: 'Wash & Fold',
    icon: 'calendar-check',
    iconColor: '#4CAF50', // Green
  },
  {
    id: 'up2',
    date: 'Saturday, Nov 5',
    time: '2:00 PM - 4:00 PM',
    status: 'Pending',
    type: 'Dry Clean',
    icon: 'calendar-clock',
    iconColor: '#FF9800', // Orange
  },
];

const pastPickups = [
  {
    id: 'pp1',
    date: 'Oct 28',
    time: '10:00 AM - 12:00 PM',
    status: 'Completed',
    type: 'Wash & Fold',
    icon: 'check-circle-outline',
    iconColor: '#2196F3', // Blue
  },
  {
    id: 'pp2',
    date: 'Oct 25',
    time: '1:00 PM - 3:00 PM',
    status: 'Cancelled',
    type: 'Ironing',
    icon: 'close-circle-outline',
    iconColor: '#F44336', // Red
  },
];
// --- End Dummy Data ---

export default function ScheduleScreen() {
  const router = useRouter();
  const colorScheme = 'light';
  const primaryColor = Colors[colorScheme].tint; // Your app's primary purple, e.g., '#5E35B1'

  const renderScheduleCard = (item: typeof upcomingPickups[0] | typeof pastPickups[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.scheduleCard}
      activeOpacity={0.8}
      onPress={() => console.log(`Schedule item ${item.id} pressed`)}
    >
      <View style={[styles.scheduleIconBg, { backgroundColor: `${item.iconColor}20` }]}>
        <MaterialCommunityIcons name={item.icon as any} size={28} color={item.iconColor} />
      </View>
      <View style={styles.cardContent}>
        <ThemedText type="subtitle" style={styles.cardTitle}>{item.date}</ThemedText>
        <ThemedText type="default" style={styles.cardTime}>{item.time}</ThemedText>
        <View style={[
          styles.statusBadge,
          item.status === 'Confirmed' ? styles.confirmedBadge :
          item.status === 'Completed' ? styles.completedBadge :
          item.status === 'Pending' ? styles.pendingBadge :
          styles.cancelledBadge
        ]}>
          <ThemedText style={[
            styles.statusText,
            item.status === 'Confirmed' ? styles.confirmedText :
            item.status === 'Completed' ? styles.completedText :
            item.status === 'Pending' ? styles.pendingText :
            styles.cancelledText
          ]}>{item.status}</ThemedText>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.fullContainer}>
     <Stack.Screen
  options={{
    header: () => (
      <BlurView
        intensity={90}
        tint="light"
        style={{
          paddingTop: Platform.OS === 'ios' ? 60 : 40,
          paddingBottom: 20,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          backgroundColor: 'rgba(245, 243, 255, 0.75)',
          overflow: 'hidden',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(94, 53, 177, 0.15)',
          // Enhanced glass effect
          shadowColor: '#5E35B1',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        {/* Glass-like decorative elements */}
        <View style={[styles.glassCircle, { top: -30, left: -20, backgroundColor: 'rgba(148, 108, 230, 0.15)' }]} />
        <View style={[styles.glassCircle, { bottom: -40, right: -30, backgroundColor: 'rgba(94, 53, 177, 0.1)' }]} />
        
        {/* Professional Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.proBackButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color={primaryColor} 
          />
        </TouchableOpacity>

        {/* Premium Title Section */}
        <View style={styles.titleContainer}>
          <View style={styles.titleIconWrapper}>
            <MaterialCommunityIcons 
              name="calendar-clock" 
              size={24} 
              color={primaryColor} 
            />
          </View>
          <ThemedText style={styles.proHeaderTitle}>
            Pickup Schedule
          </ThemedText>
        </View>
        
        {/* Action Button */}
        <TouchableOpacity
          style={styles.headerActionButton}
          onPress={() => console.log('Calendar view pressed')}
        >
          <MaterialIcons 
            name="view-day" 
            size={22} 
            color={primaryColor} 
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
    { paddingTop: Platform.OS === 'ios' ? 110 : 90 } // Adjust to match your header height
  ]}
>
        <View style={styles.heroSection}>
          <View style={styles.heroIconBackground}>
            <MaterialCommunityIcons name="calendar-clock" size={60} color={primaryColor} />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>Your Pickup Schedule</ThemedText>
          <ThemedText style={styles.heroTagline}>Keep track of all your laundry pickups.</ThemedText>
        </View>

        <ThemedText type="subtitle" style={styles.sectionTitle}>Upcoming Pickups</ThemedText>
        {upcomingPickups.length > 0 ? (
          upcomingPickups.map(renderScheduleCard)
        ) : (
          <View style={styles.emptyStateCard}>
            <MaterialIcons name="event-note" size={50} color="#ccc" />
            <ThemedText style={styles.emptyText}>No upcoming pickups</ThemedText>
            <ThemedText style={styles.emptySubText}>Book a new pickup to see it here.</ThemedText>
          </View>
        )}

        <ThemedText type="subtitle" style={styles.sectionTitle}>Past Pickups</ThemedText>
        {pastPickups.length > 0 ? (
          pastPickups.map(renderScheduleCard)
        ) : (
          <View style={styles.emptyStateCard}>
            <MaterialIcons name="history" size={50} color="#ccc" />
            <ThemedText style={styles.emptyText}>No past pickups found</ThemedText>
            <ThemedText style={styles.emptySubText}>Completed and cancelled orders will appear here.</ThemedText>
          </View>
        )}

        <View style={styles.noteBox}>
          <MaterialIcons name="info" size={22} color={primaryColor} />
          <ThemedText style={styles.noteText} type="default">
            Need to change a pickup? You can modify confirmed schedules or contact support for urgent requests.
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.bookPickupButton} activeOpacity={0.8} onPress={() => console.log('Book New Pickup Pressed')}>
          <MaterialCommunityIcons name="plus-circle-outline" size={20} color="white" style={styles.bookPickupButtonIcon} />
          <ThemedText style={styles.bookPickupButtonText}>Book New Pickup</ThemedText>
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
  headerBackButton: {
    backgroundColor: '#EDE7F6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
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
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#333',
    marginLeft: 0,
    marginTop: 25,
    marginBottom: 15,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // More depth
    shadowOpacity: 0.1, // Softer
    shadowRadius: 10, // More blur
    elevation: 5,
  },
  scheduleIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10, // Increased padding
    paddingVertical: 5,    // Increased padding
    borderRadius: 12,      // More pill-like
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13, // Slightly larger text
    fontWeight: '600',
  },
  confirmedBadge: { backgroundColor: '#E8F5E9' },
  confirmedText: { color: '#2E7D32' },
  pendingBadge: { backgroundColor: '#FFF3E0' },
  pendingText: { color: '#E65100' },
  completedBadge: { backgroundColor: '#E3F2FD' },
  completedText: { color: '#1565C0' },
  cancelledBadge: { backgroundColor: '#FFEBEE' },
  cancelledText: { color: '#D32F2F' },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ede7f6',
    borderRadius: 15,
    padding: 20, // Increased padding
    marginTop: 25,
    marginBottom: 20,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // More pronounced
    shadowRadius: 6, // More blur
    elevation: 3,
  },
  noteText: {
    color: '#5E35B1',
    fontSize: 15, // Slightly larger
    lineHeight: 24, // More readable line height
    marginLeft: 15, // More space from icon
    flex: 1,
  },
  emptyStateCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, // Softer
    shadowRadius: 8, // More blur
    elevation: 2,
  },
  emptyText: {
    fontSize: 17, // Larger
    fontWeight: '700',
    color: '#757575',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 15, // Larger
    color: '#9E9E9E',
    marginTop: 5,
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
    paddingBottom: Platform.OS === 'ios' ? 35 : 20, // More bottom padding
  },
  bookPickupButton: {
    backgroundColor: '#5E35B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18, // More vertical padding
    borderRadius: 30,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, // More prominent
    shadowRadius: 20, // More blur
    elevation: 12,
  },
  bookPickupButtonText: {
    color: 'white',
    fontSize: 19, // Larger text
    fontWeight: 'bold',
    letterSpacing: 0.8, // More tracking
  },
  bookPickupButtonIcon: {
    marginRight: 10,
  },

   proBackButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(94, 53, 177, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.08)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleIconWrapper: {
    backgroundColor: 'rgba(94, 53, 177, 0.1)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  proHeaderTitle: {
    fontWeight: '700',
    fontSize: 22,
    color: '#2D1155',
    letterSpacing: -0.4,
  },
  headerActionButton: {
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
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});