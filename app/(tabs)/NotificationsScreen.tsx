import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur';

const mockNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Order Completed',
    message: 'Your laundry order #1234 has been completed and is ready for pickup',
    time: '2 hours ago',
    read: false,
    icon: 'check-circle',
    color: '#4CAF50'
  },
  {
    id: '2',
    type: 'promo',
    title: 'Special Offer',
    message: 'Get 20% off your next dry cleaning order this week',
    time: '1 day ago',
    read: true,
    icon: 'tag',
    color: '#FF9800'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Pickup Reminder',
    message: "Don't forget to pickup your order before 8 PM today",
    time: '3 days ago',
    read: true,
    icon: 'bell',
    color: '#2196F3'
  },
  {
    id: '4',
    type: 'order',
    title: 'Order Received',
    message: "We've received your laundry order #1235",
    time: '1 week ago',
    read: true,
    icon: 'shopping',
    color: '#5E35B1'
  },
]

export default class NotificationsScreen extends Component {
  state = {
    notifications: mockNotifications,
    refreshing: false,
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    setTimeout(() => {
      this.setState({ refreshing: false })
      // In a real app, fetch new notifications here
    }, 1500)
  }

  markAsRead = (id) => {
    this.setState(prevState => ({
      notifications: prevState.notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    }))
  }

  clearAll = () => {
    this.setState({ notifications: [] })
  }

  renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => this.markAsRead(item.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons
          name={item.icon}
          size={24}
          color={item.color}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  )

  render() {
  const { notifications, refreshing } = this.state
  return (
    <View style={styles.container}>
      {/* Improved Glass Header */}
      <View style={styles.container}>
  {/* Premium Glass Header */}
  <BlurView 
    intensity={90}
    tint="light"
    style={styles.glassHeader}
  >
    {/* Decorative elements */}
    <View style={styles.glassCircle} />
    <View style={styles.glassCircle2} />
    
    <View style={styles.headerContent}>
      {/* Back button */}
     
      
      {/* Title with icon */}
      <View style={styles.titleContainer}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons 
            name="bell-ring" 
            size={24} 
            color="#5E35B1" 
          />
          {notifications.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {notifications.length}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>Notifications</Text>
      </View>
      
      {/* Clear button */}
      {notifications.length > 0 ? (
        <TouchableOpacity 
          onPress={this.clearAll} 
          style={styles.clearButton}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons 
            name="trash-can-outline" 
            size={24} 
            color="#5E35B1" 
          />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.clearPlaceholder} />
      )}
    </View>
  </BlurView>

  {/* Notification list */}
  {notifications.length > 0 ? (
    <FlatList
      data={notifications}
      renderItem={this.renderNotification}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          tintColor="#5E35B1"
          colors={['#5E35B1']}
        />
      }
    />
  ) : (
    // Empty state view
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="bell-off-outline" 
        size={80} 
        color="#D1C4E9" 
      />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        You'll see important updates here
      </Text>
    </View>
  )}
</View>
         {/* Notification list */}
  {notifications.length > 0 ? (
    <FlatList
      data={notifications}
      renderItem={this.renderNotification}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          tintColor="#5E35B1"
          colors={['#5E35B1']}
        />
      }
    />
  ) : (
    // Empty state view
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="bell-off-outline" 
        size={80} 
        color="#D1C4E9" 
      />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        You'll see important updates here
      </Text>
    </View>
  )}
</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  clearText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      },
    }),
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#5E35B1',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5E35B1',
    alignSelf: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },

 
clearBtn: {
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 12,
  backgroundColor: 'rgba(255,87,34,0.08)',
},

  glassHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(243, 239, 255, 0.8)',
    overflow: 'hidden',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94, 53, 177, 0.15)',
    zIndex: 10,
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.05)',
  },
  iconBadge: {
    position: 'relative',
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF5252',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2D1155',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94, 53, 177, 0.12)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.08)',
  },
  clearText: {
    color: '#5E35B1',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  clearPlaceholder: {
    width: 70,
  },
  listContainer: {
    padding: 20,
    paddingTop: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5E35B1',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7E57C2',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
})