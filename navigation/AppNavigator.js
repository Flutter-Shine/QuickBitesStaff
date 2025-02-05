// navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import PendingOrdersScreen from '../screens/PendingOrdersScreen';
import CompletedOrdersScreen from '../screens/CompletedOrdersScreen';
import MenuItemsScreen from '../screens/MenuItemsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Pending Orders" component={PendingOrdersScreen} />
        <Tab.Screen name="Completed Orders" component={CompletedOrdersScreen} />
        <Tab.Screen name="Menu Items" component={MenuItemsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
