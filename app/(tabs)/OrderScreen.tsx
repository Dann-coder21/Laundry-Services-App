import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Platform, SafeAreaView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const mockOrders = [
  {
    id: '1',
    status: 'Processing',
    items: 3,
    total: '$24.50',
    date: 'Today, 10:30 AM',
    service: 'Wash & Fold'
  },
  {
    id: '2',
    status: 'Completed',
    items: 5,
    total: '$38.75',
    date: 'Yesterday, 2:15 PM',
    service: 'Dry Cleaning'
  },
  {
    id: '3',
    status: 'Ready for Pickup',
    items: 2,
    total: '$15.00',
    date: 'May 15, 9:00 AM',
    service: 'Ironing'
  },
];

export default class OrderScreen extends Component {
  state = {
    activeTab: 'Active',
    refreshing: false,
    orders: mockOrders,
  }

  setTab = (tab) => {
    this.setState({ activeTab: tab });
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 1500);
  }

  renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => console.log('Navigate to order details', item.id)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'Completed' ? styles.completedBadge :
          item.status === 'Ready for Pickup' ? styles.readyBadge :
          styles.processingBadge
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar" size={18} color="#5E35B1" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="tshirt-crew" size={18} color="#5E35B1" />
          <Text style={styles.detailText}>{item.items} items</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="payments" size={18} color="#5E35B1" />
          <Text style={styles.detailText}>{item.total}</Text>
        </View>
      </View>
      
      <View style={styles.serviceTag}>
        <MaterialCommunityIcons 
          name={
            item.service === 'Wash & Fold' ? 'washing-machine' :
            item.service === 'Dry Cleaning' ? 'hanger' : 'iron'
          } 
          size={16} 
          color="#5E35B1" 
          style={{ marginRight: 6 }}
        />
        <Text style={styles.serviceText}>{item.service}</Text>
      </View>
      
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>View Details</Text>
        <MaterialIcons name="arrow-forward" size={18} color="#5E35B1" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  renderContent() {
    const { orders, refreshing, activeTab } = this.state;
    
    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => {
      if (activeTab === 'Active') {
        return order.status !== 'Completed';
      } else if (activeTab === 'Completed') {
        return order.status === 'Completed';
      } else if (activeTab === 'Cancelled') {
        return order.status === 'Cancelled';
      }
      return true;
    });

    return (
      filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={this.renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
              tintColor="#5E35B1"
              colors={['#5E35B1']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name="clipboard-text-outline" 
                size={72} 
                color="#D1C4E9" 
              />
              <Text style={styles.emptyTitle}>No Orders Found</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'Active' 
                  ? "You don't have any active orders at the moment" 
                  : `No ${activeTab.toLowerCase()} orders to display`}
              </Text>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => console.log('Place New Order')}
              >
                <Text style={styles.actionButtonText}>Place New Order</Text>
              </TouchableOpacity>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons 
            name="clipboard-text-outline" 
            size={72} 
            color="#D1C4E9" 
          />
          <Text style={styles.emptyTitle}>No Orders Found</Text>
          <Text style={styles.emptyText}>
            {activeTab === 'Active' 
              ? "You don't have any active orders at the moment" 
              : `No ${activeTab.toLowerCase()} orders to display`}
          </Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('Place New Order')}
          >
            <Text style={styles.actionButtonText}>Place New Order</Text>
          </TouchableOpacity>
        </View>
      )
    );
  }

  render() {
    const { activeTab } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {/* Premium Glass Header */}
        <BlurView
          intensity={90}
          tint="light"
          style={styles.glassHeader}
        >
          <View style={styles.glassCircle} />
          <View style={styles.glassCircle2} />
          
          <View style={styles.headerContent}>
            <MaterialCommunityIcons 
              name="clipboard-text-outline" 
              size={28} 
              color="#5E35B1" 
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>My Orders</Text>
          </View>
        </BlurView>

        {/* Modern Tab Bar */}
        <View style={styles.tabContainer}>
          {['Active', 'Completed', 'Cancelled'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
                activeTab === tab && styles.activeTabShadow
              ]}
              onPress={() => this.setTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        {this.renderContent()}
        
        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => console.log('Place New Order')}
        >
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  glassHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 25,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(243, 239, 255, 0.75)',
    overflow: 'hidden',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(94, 53, 177, 0.15)',
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
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 24,
    color: '#2D1155',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    borderColor: '#5E35B1',
    zIndex: 2,
  },
  activeTabShadow: {
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#5E35B1',
    fontWeight: '700',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  processingBadge: {
    backgroundColor: '#FFF3E0',
  },
  readyBadge: {
    backgroundColor: '#E3F2FD',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderDetails: {
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3E5F5',
  },
  serviceText: {
    fontSize: 14,
    color: '#6A1B9A',
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(94, 53, 177, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(94, 53, 177, 0.1)',
  },
  actionButtonText: {
    color: '#5E35B1',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
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
    maxWidth: '80%',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5E35B1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
});