// components/MenuItemForm.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const MenuItemForm = ({
  title,
  name,
  price,
  stock,
  description,
  onNameChange,
  onPriceChange,
  onStockChange,
  onDescriptionChange,
  onSubmit,
  onCancel
}) => (
  <View style={styles.formContainer}>
    <Text style={styles.subtitle}>{title}</Text>
    <TextInput
      style={styles.input}
      placeholder="Item Name"
      value={name}
      onChangeText={onNameChange}
    />
    <TextInput
      style={styles.input}
      placeholder="Price"
      value={price}
      onChangeText={onPriceChange}
      keyboardType="numeric"
    />
    <TextInput
      style={styles.input}
      placeholder="Stock"
      value={stock}
      onChangeText={onStockChange}
      keyboardType="numeric"
    />
    <TextInput
      style={[styles.input, styles.multiline]}
      placeholder="Description"
      value={description}
      onChangeText={onDescriptionChange}
      multiline
    />
    <Button title="Submit" onPress={onSubmit} />
    <View style={styles.spacer} />
    <Button title="Cancel" onPress={onCancel} color="red" />
  </View>
);

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top'
  },
  spacer: {
    height: 20
  }
});

export default MenuItemForm;
