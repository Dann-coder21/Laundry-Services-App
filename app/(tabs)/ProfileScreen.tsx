import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Easing,
  Platform  
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from "expo-router";

const USER_DATA = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatarUri: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200&d=mp',
  membershipLevel: 'Gold Member',
  points: 1250,
};

const PROFILE_MENU_ITEMS = [
  { id: '1', title: 'Edit Profile', icon: 'account-edit', action: () => Alert.alert('Action', 'Edit Profile') },
  { id: '2', title: 'Change Password', icon: 'lock-reset', action: () => Alert.alert('Action', 'Change Password') },
  { id: '3', title: 'My Addresses', icon: 'map-marker-outline', action: () => Alert.alert('Action', 'Go to My Addresses') },
  { id: '4', title: 'Payment Methods', icon: 'credit-card-outline', action: () => Alert.alert('Action', 'Go to Payment Methods') },
  { id: '5', title: 'Order History', icon: 'history', action: () => Alert.alert('Action', 'Go to Order History') },
  { id: '6', title: 'Notifications', icon: 'bell-outline', action: () => Alert.alert('Action', 'Manage Notifications') },
  { id: '7', title: 'Privacy Policy', icon: 'shield-lock-outline', action: () => Alert.alert('Action', 'Read Privacy Policy') },
  { id: '8', title: 'Help & Support', icon: 'help-circle-outline', action: () => Alert.alert('Action', 'Go to Help & Support') },
];

export default class ProfileScreen extends Component {
   


  scaleValue = new Animated.Value(1);

  animatePressIn = () => {
    Animated.spring(this.scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  animatePressOut = () => {
    Animated.spring(this.scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('User logged out') },
      ],
      { cancelable: true }
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* Glass Header */}
        <BlurView intensity={85} tint="light" style={styles.glassHeader}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: USER_DATA.avatarUri }} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerName}>{USER_DATA.name}</Text>
              <Text style={styles.headerSub}>{USER_DATA.membershipLevel}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Settings', 'Open settings')}>
            <MaterialCommunityIcons name="cog-outline" size={28} color="#5E35B1" />
          </TouchableOpacity>
        </BlurView>

        <ScrollView
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: 100 }
          ]}
        >
          

          {/* User Info Card */}
          <LinearGradient
            colors={['#5E35B1', '#7E57C2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: USER_DATA.avatarUri }} style={styles.avatar} />
              <View style={styles.badge}>
                <MaterialCommunityIcons name="crown" size={16} color="#FFD700" />
              </View>
            </View>
            
            <Text style={styles.userName}>{USER_DATA.name}</Text>
            <Text style={styles.membership}>{USER_DATA.membershipLevel}</Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="email-outline" size={18} color="rgba(255,255,255,0.8)" />
                <Text style={styles.userDetails}>{USER_DATA.email}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="phone-outline" size={18} color="rgba(255,255,255,0.8)" />
                <Text style={styles.userDetails}>{USER_DATA.phone}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="star-outline" size={18} color="rgba(255,255,255,0.8)" />
                <Text style={styles.userDetails}>{USER_DATA.points} Points</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => Alert.alert('Edit Profile', 'Navigate to edit profile screen')}
              activeOpacity={0.8}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
              <MaterialCommunityIcons name="pencil-outline" size={18} color="#5E35B1" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            {PROFILE_MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === PROFILE_MENU_ITEMS.length - 1 && styles.lastMenuItem,
                ]}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: styles.menuIconContainer.backgroundColor }]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={20}
                    color="#5E35B1"
                  />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#CCC" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <Animated.View style={{ transform: [{ scale: this.scaleValue }] }}>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={this.handleLogout} 
              activeOpacity={0.7}
              onPressIn={this.animatePressIn}
              onPressOut={this.animatePressOut}
            >
              <MaterialCommunityIcons name="logout" size={20} color="#D32F2F" />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.appVersion}>Laundry Pro v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
    fontFamily: 'sans-serif-medium',
  },
  profileCard: {
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 16,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5E35B1',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 5,
  },
  membership: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  userDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 10,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editProfileButtonText: {
    color: '#5E35B1',
    fontWeight: '600',
    fontSize: 15,
    marginRight: 8,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE7F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginLeft: 10,
  },
  appVersion: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'sans-serif',
  },
  glassHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop:  Platform.OS === 'ios' ? 50 : 30,
  paddingBottom: 18,
  paddingHorizontal: 20,
  backgroundColor: 'rgba(255,255,255,0.85)',
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
  shadowColor: '#5E35B1',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 8,
  marginBottom: 10,
},
headerLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
headerAvatar: {
  width: 48,
  height: 48,
  borderRadius: 24,
  marginRight: 12,
  borderWidth: 2,
  borderColor: '#EDE7F6',
},
headerName: {
  fontSize: 18,
  fontWeight: '700',
  color: '#2D1155',
},
headerSub: {
  fontSize: 13,
  color: '#FFD700',
  fontWeight: '600',
},
});