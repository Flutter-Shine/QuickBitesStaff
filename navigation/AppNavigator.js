import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import PendingOrdersScreen from '../screens/PendingOrdersScreen';
import PreparedOrdersScreen from '../screens/PreparedOrdersScreen';
import ScanScreen from '../screens/ScanScreen'; // new Scan screen
import MenuItemsScreen from '../screens/MenuItemsScreen';
import CompletedOrdersScreen from '../screens/CompletedOrdersScreen';

const Tab = createBottomTabNavigator();

// Bottom tab navigator for orders and scan
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#800000' }, // Maroon background
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Pending Orders') {
            iconName = focused ? 'hourglass' : 'hourglass-outline';
          } else if (route.name === 'Prepared Orders') {
            iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
          } else if (route.name === 'Scan') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Pending Orders" component={PendingOrdersScreen} />
      <Tab.Screen name="Prepared Orders" component={PreparedOrdersScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#003B6F' }, // Navy header
          headerTintColor: '#fdf5e6',                   // Cream header text
          headerTitleStyle: { fontSize: 22, fontWeight: 'bold' },
          drawerActiveTintColor: '#800000',             // Maroon text for active drawer items
          drawerInactiveTintColor: '#800000',           // Maroon text for inactive drawer items
        }}
      >
        {/* Home shows the bottom tab navigation */}
        <Drawer.Screen name="Home" component={BottomTabNavigator} />
        <Drawer.Screen name="Menu Items" component={MenuItemsScreen} />
        <Drawer.Screen name="Completed Orders" component={CompletedOrdersScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
