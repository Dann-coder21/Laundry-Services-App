import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter, Stack } from 'expo-router';

const WeightGuide = () => {
  const router = useRouter(); 
  
  const commonItems = [
    { name: 'T-Shirt', weight: '0.2kg', icon: 'tshirt-crew' },
    { name: 'Jeans', weight: '0.5kg', icon: 'human-male' },
    { name: 'Dress', weight: '0.4kg', icon: 'dresser' },
    { name: 'Towel', weight: '0.6kg', icon: 'beach' },
    { name: 'Bed Sheet', weight: '1.0kg', icon: 'bed' },
    { name: 'Pillowcase', weight: '0.3kg', icon: 'pillow' },
    { name: 'Sweater', weight: '0.5kg', icon: 'hoodie' },
    { name: 'Underwear', weight: '0.1kg', icon: 'human-underwear' },
  ];

  const weightExamples = [
    {
      title: 'Light Load (3-5kg)',
      description: 'Small basket for 1-2 people',
      items: ['5-7 shirts', '3-5 pants', '2-3 towels', '1 bedsheet'],
      icon: 'basket-outline',
      color: '#4CAF50'
    },
    {
      title: 'Medium Load (6-9kg)',
      description: 'Standard basket for 2-3 people',
      items: ['8-10 shirts', '5-7 pants', '4-5 towels', '2 bedsheets'],
      icon: 'basket-fill',
      color: '#FFC107'
    },
    {
      title: 'Heavy Load (10-15kg)',
      description: 'Large basket for 3-4 people',
      items: ['12-15 shirts', '8-10 pants', '6-8 towels', '3-4 bedsheets'],
      icon: 'basket-unfill',
      color: '#F44336'
    }
  ];

  return (
    <View style={styles.fullContainer}>
      <Stack.Screen options={{ headerShown: false }} /> 
      {/* Glass Header */}
      <BlurView
        intensity={90}
        tint="light"
        style={styles.glassHeader}
      >
        {/* Decorative elements */}
        <View style={[styles.glassCircle, styles.glassCircleTop]} />
        <View style={[styles.glassCircle, styles.glassCircleBottom]} />
        
        <TouchableOpacity
          style={styles.backButton}
           onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="arrow-left" 
            size={24} 
            color="#5E35B1" 
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <MaterialCommunityIcons 
            name="scale-bathroom" 
            size={28} 
            color="#5E35B1" 
            style={styles.titleIcon}
          />
          <Text style={styles.headerTitle}>
            Weight Guide
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => console.log('Info pressed')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="help-circle-outline" 
            size={24} 
            color="#5E35B1" 
          />
        </TouchableOpacity>
      </BlurView>

      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Visual Guide Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visual Weight Guide</Text>
          <Text style={styles.sectionDescription}>
            See what different weights look like in everyday laundry
          </Text>
          
          <View style={styles.visualGuide}>
            <View style={styles.visualItem}>
              <View style={[styles.weightCircle, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.weightValue}>3-5kg</Text>
                <Text style={styles.weightLabel}>Light</Text>
              </View>
              <MaterialCommunityIcons 
                name="basket-outline" 
                size={60} 
                color="#4CAF50" 
                style={styles.loadIcon}
              />
            </View>
            
            <View style={styles.visualItem}>
              <View style={[styles.weightCircle, { backgroundColor: '#FFF8E1' }]}>
                <Text style={styles.weightValue}>6-9kg</Text>
                <Text style={styles.weightLabel}>Medium</Text>
              </View>
              <MaterialCommunityIcons 
                name="basket-fill" 
                size={60} 
                color="#FFC107" 
                style={styles.loadIcon}
              />
            </View>
            
            <View style={styles.visualItem}>
              <View style={[styles.weightCircle, { backgroundColor: '#FFEBEE' }]}>
                <Text style={styles.weightValue}>10-15kg</Text>
                <Text style={styles.weightLabel}>Heavy</Text>
              </View>
              <MaterialCommunityIcons 
                name="basket-unfill" 
                size={60} 
                color="#F44336" 
                style={styles.loadIcon}
              />
            </View>
          </View>
        </View>

        {/* Detailed Weight Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Examples</Text>
          
          {weightExamples.map((example, index) => (
            <View key={index} style={[styles.exampleCard, { borderLeftColor: example.color }]}>
              <View style={styles.exampleHeader}>
                <MaterialCommunityIcons 
                  name={example.icon} 
                  size={28} 
                  color={example.color} 
                  style={styles.exampleIcon}
                />
                <View>
                  <Text style={styles.exampleTitle}>{example.title}</Text>
                  <Text style={styles.exampleDescription}>{example.description}</Text>
                </View>
              </View>
              
              <View style={styles.exampleItems}>
                {example.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.itemRow}>
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={18} 
                      color="#4CAF50" 
                      style={styles.bulletIcon}
                    />
                    <Text style={styles.itemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Common Items Reference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Item Weights</Text>
          <Text style={styles.sectionDescription}>
            Average weights for common laundry items
          </Text>
          
          <View style={styles.itemsGrid}>
            {commonItems.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={32} 
                  color="#5E35B1" 
                  style={styles.itemIcon}
                />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemWeight}>{item.weight}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pro Tips */}
        <LinearGradient
          colors={['#FFFDE7', '#FFF9C4']}
          style={styles.tipContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons name="lightbulb-on" size={32} color="#F57C00" />
          <Text style={styles.tipTitle}>Pro Tips</Text>
          <Text style={styles.tipText}>
            • Don't overload bags - clothes need space to move for proper cleaning{'\n'}
            • When in doubt, split into two loads!{'\n'}
            • Heavy fabrics like jeans weigh more than light fabrics like t-shirts{'\n'}
            • Wet clothes weigh 2-3x more than dry clothes
          </Text>
        </LinearGradient>

        {/* Help Button */}
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Still Unsure? Get Help Estimating</Text>
          <MaterialCommunityIcons name="chat-question" size={24} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
  backButton: {
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
  },
  titleIcon: {
    marginRight: 10,
  },
  headerTitle: {
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
  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  visualGuide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  visualItem: {
    alignItems: 'center',
    width: '30%',
  },
  weightCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  weightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weightLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loadIcon: {
    marginTop: 10,
  },
  exampleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exampleIcon: {
    marginRight: 15,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  exampleDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  exampleItems: {
    marginLeft: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 15,
    color: '#555',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  itemIcon: {
    marginBottom: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  itemWeight: {
    fontSize: 14,
    color: '#5E35B1',
    fontWeight: '600',
    marginTop: 4,
  },
  tipContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFECB3',
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F57C00',
    marginTop: 10,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 15,
    color: '#5D4037',
    lineHeight: 24,
  },
  helpButton: {
    backgroundColor: '#5E35B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  helpButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 10,
  },
});

export default WeightGuide;