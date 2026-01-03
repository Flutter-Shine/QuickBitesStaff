// components/MenuItemRow.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const MenuItemRow = ({ item, onPress }) => (
  <TouchableOpacity style={styles.itemRow} onPress={() => onPress(item)}>
    <Text style={styles.itemText}>
      {item.name} - P{item.price} - Stock: {item.stock}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemText: {
    fontSize: 16
  }
});

export default MenuItemRow;
