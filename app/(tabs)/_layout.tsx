import { Tabs } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { Animated, View, Platform } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';


const AnimatedView = Animated.createAnimatedComponent(View);

function TabBarIcon({ icon, focused }: { icon: React.ReactNode; focused: boolean }) {
  const scale = useRef(new Animated.Value(focused ? 1.2 : 1)).current;
  const opacity = useRef(new Animated.Value(focused ? 1 : 0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: focused ? 1 : 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <AnimatedView
      style={{
        transform: [{ scale }],
        opacity,
        padding: focused ? 10 : 8,
        borderRadius: 16,
        backgroundColor: focused ? 'rgba(94, 53, 177, 0.12)' : 'transparent',
      }}
    >
      {icon}
    </AnimatedView>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;

  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5E35B1',
        tabBarInactiveTintColor: '#B0AFC6',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginBottom: 6,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 8,
          right: 8,
          bottom: 8,
          height: 70,
          borderRadius: 24,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          // Purple box shadow all around
          shadowColor: '#7C4DFF',
          shadowOffset: { width: 0, height: 0 }, // All sides
          shadowOpacity: 0.25,
          shadowRadius: 18,
          elevation: 18, // Android
          ...Platform.select({
            web: {
              boxShadow: '0 0 32px 0 rgba(124,77,255,0.18)',
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              icon={<MaterialCommunityIcons name="home" size={28} color={color} />}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="OrderScreen"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              icon={<MaterialCommunityIcons name="clipboard-list" size={28} color={color} />}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="NotificationsScreen"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              icon={<MaterialIcons name="notifications" size={28} color={color} />}
              focused={focused}
            />
          ),
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: '#FF5722',
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
          },
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              icon={<MaterialIcons name="person" size={28} color={color} />}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}