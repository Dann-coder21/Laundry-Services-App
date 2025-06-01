import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';


export default function EditScheduleScreen() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeatOption, setRepeatOption] = useState('weekly');

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setDate(new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      ));
    }
  };

  return (
    <ThemedView style={styles.fullContainer}>
     <Stack.Screen
  options={{
    header: () => (
      <BlurView
        intensity={85}
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
          backgroundColor: 'rgba(245, 243, 255, 0.8)',
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
          style={styles.proEditBackButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#5E35B1" 
          />
        </TouchableOpacity>

        {/* Title */}
        <ThemedText style={styles.editHeaderTitle}>
          Edit Schedule
        </ThemedText>
        
        {/* Action Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => console.log('Save pressed')}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.saveButtonText}>Save</ThemedText>
        </TouchableOpacity>
      </BlurView>
    ),
    headerTransparent: true,
    headerShadowVisible: false,
  }}
/>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar-edit" size={60} color="#5E35B1" />
          </View>
          <ThemedText type="title" style={styles.headerTitle}>Edit Pickup Schedule</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Adjust your laundry pickup date, time, and frequency
          </ThemedText>
        </View>

        {/* Date Selection Card */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Pickup Date</ThemedText>
          <TouchableOpacity 
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialCommunityIcons name="calendar-month" size={24} color="#5E35B1" />
            <ThemedText style={styles.dateTimeText}>
              {date.toLocaleDateString()}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Time Selection Card */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Pickup Time</ThemedText>
          <TouchableOpacity 
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <MaterialCommunityIcons name="clock-outline" size={24} color="#5E35B1" />
            <ThemedText style={styles.dateTimeText}>
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </ThemedText>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}
        </View>

        {/* Repeat Options Card */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Repeat Schedule</ThemedText>
          <View style={styles.repeatOptions}>
            {['weekly', 'biweekly', 'monthly', 'none'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.repeatOption,
                  repeatOption === option && styles.selectedRepeatOption
                ]}
                onPress={() => setRepeatOption(option)}
              >
                <MaterialCommunityIcons 
                  name={
                    option === 'weekly' ? 'calendar-week' :
                    option === 'biweekly' ? 'calendar-week-begin' :
                    option === 'monthly' ? 'calendar-month' : 'calendar-remove'
                  } 
                  size={20} 
                  color={repeatOption === option ? 'white' : '#5E35B1'} 
                />
                <ThemedText style={[
                  styles.repeatOptionText,
                  repeatOption === option && styles.selectedRepeatOptionText
                ]}>
                  {option === 'weekly' ? 'Weekly' :
                   option === 'biweekly' ? 'Bi-Weekly' :
                   option === 'monthly' ? 'Monthly' : 'One Time'}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Special Instructions</ThemedText>
          <ThemedText style={styles.notesText}>
            Any special requests for our pickup team?
          </ThemedText>
          <View style={styles.notesInput}>
            <MaterialCommunityIcons name="note-edit-outline" size={20} color="#666" />
            <ThemedText style={styles.notesPlaceholder}>Add notes here...</ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <LinearGradient
        colors={['#5E35B1', '#7C4DFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.buttonContainer}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
          <MaterialCommunityIcons name="check-circle" size={20} color="white" />
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
  headerSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  iconContainer: {
    backgroundColor: 'rgba(94,53,177,0.1)',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: '80%',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
    padding: 15,
  },
  dateTimeText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  repeatOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  repeatOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE7F6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  selectedRepeatOption: {
    backgroundColor: '#5E35B1',
    borderColor: '#5E35B1',
  },
  repeatOptionText: {
    fontSize: 14,
    marginLeft: 10,
    color: '#5E35B1',
  },
  selectedRepeatOptionText: {
    color: 'white',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  notesInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
  },
  notesPlaceholder: {
    fontSize: 14,
    color: '#999',
    marginLeft: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
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
proEditBackButton: {
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
  editHeaderTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2D1155',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1, // Allows buttons to remain clickable
  },
  saveButton: {
    backgroundColor: 'rgba(94, 53, 177, 0.12)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.1)',
  },
  saveButtonText: {
    color: '#5E35B1',
    fontWeight: '600',
    fontSize: 16,
  },
  glassCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});