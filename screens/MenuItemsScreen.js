// screens/MenuItemsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet } from 'react-native';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import MenuItemRow from '../components/MenuItemRow';
import MenuItemForm from '../components/MenuItemForm';

const MenuItemsScreen = () => {
  // Control form visibility and mode (add or edit)
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  // Form state for both adding and editing
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formDescription, setFormDescription] = useState('');
  // Firestore items
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menuItems'), (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData);
    });
    return () => unsubscribe();
  }, []);

  // Custom change handler for the price field.
  // It allows digits and at most one decimal point.
  const handlePriceChange = (text) => {
    // Remove any characters except digits and period.
    let formatted = text.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point is present.
    const parts = formatted.split('.');
    if (parts.length > 2) {
      formatted = parts[0] + '.' + parts.slice(1).join('');
    }
    setFormPrice(formatted);
  };

  // Custom change handler for the stock field.
  // It allows only digits (integers).
  const handleStockChange = (text) => {
    const formatted = text.replace(/\D/g, '');
    setFormStock(formatted);
  };

  const handleSubmit = async () => {
    if (!formName.trim() || !formPrice.trim() || !formStock.trim()) {
      Alert.alert('Error', 'Please fill in the required fields.');
      return;
    }
    
    if (editingItem) {
      // Update existing item
      try {
        await updateDoc(doc(db, 'menuItems', editingItem.id), {
          name: formName,
          price: parseFloat(formPrice),
          stock: parseInt(formStock, 10),
          description: formDescription
        });
        Alert.alert('Success', 'Item updated successfully!');
        setEditingItem(null);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      // Add new item
      try {
        await addDoc(collection(db, 'menuItems'), {
          name: formName,
          price: parseFloat(formPrice),
          stock: parseInt(formStock, 10),
          description: formDescription,
          createdAt: new Date()
        });
        Alert.alert('Success', 'Item added successfully!');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
    // Reset form and hide it
    setFormName('');
    setFormPrice('');
    setFormStock('');
    setFormDescription('');
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setFormName('');
    setFormPrice('');
    setFormStock('');
    setFormDescription('');
  };

  const handleItemPress = (item) => {
    Alert.alert(
      'Select Action',
      'What would you like to do?',
      [
        {
          text: 'Edit',
          onPress: () => {
            setEditingItem(item);
            setFormName(item.name);
            setFormPrice(item.price.toString());
            setFormStock(item.stock.toString());
            setFormDescription(item.description || '');
          }
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(item.id)
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
      Alert.alert('Success', 'Item deleted successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Items</Text>
      {(showAddForm || editingItem) && (
        <MenuItemForm
          title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          name={formName}
          price={formPrice}
          stock={formStock}
          description={formDescription}
          onNameChange={setFormName}
          onPriceChange={handlePriceChange}
          onStockChange={handleStockChange}
          onDescriptionChange={setFormDescription}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
      {/* Only show "Add New Item" button and list if not in edit mode */}
      {(!editingItem) && (
        <>
          {!showAddForm && (
            <Button title="Add New Item" onPress={() => setShowAddForm(true)} />
          )}
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <MenuItemRow item={item} onPress={handleItemPress} />
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16
  },
  list: {
    flex: 1,
    marginTop: 16
  },
  listContent: {
    paddingBottom: 16
  }
});

export default MenuItemsScreen;
