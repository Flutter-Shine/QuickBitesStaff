// screens/PendingOrdersScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PendingOrdersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pending Orders Placeholder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20
  }
});

export default PendingOrdersScreen;
