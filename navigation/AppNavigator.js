// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
      screenOptions={{
        headerShown: false,
      }}
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
      <Drawer.Navigator initialRouteName="Home">
        {/* Home shows the bottom tab navigation */}
        <Drawer.Screen name="Home" component={BottomTabNavigator} />
        <Drawer.Screen name="Menu Items" component={MenuItemsScreen} />
        <Drawer.Screen name="Completed Orders" component={CompletedOrdersScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
