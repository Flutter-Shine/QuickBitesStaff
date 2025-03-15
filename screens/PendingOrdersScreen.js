// screens/PendingOrdersScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const PendingOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  // Set header options: navy header with cream title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Pending Orders',
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#003B6F' },
      headerTitleStyle: { color: '#fdf5e6', fontSize: 22, fontWeight: 'bold' },
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pendingOrders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  const handleMarkPrepared = (order) => {
    Alert.alert(
      'Order Prepared?',
      'Is the order prepared?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Create a batch to perform atomic writes
              const batch = writeBatch(db);

              // Reference for the new document in preparedOrders collection
              const preparedRef = doc(collection(db, 'preparedOrders'));
              // Prepare new data with updated status (and keep timeslot field)
              const preparedData = { ...order, status: 'prepared' };
              delete preparedData.id; // Remove the id property since it will be auto-generated
              batch.set(preparedRef, preparedData);

              // Delete the document from pendingOrders
              const pendingRef = doc(db, 'pendingOrders', order.id);
              batch.delete(pendingRef);

              // Create a new notification document in the notifications collection
              const notificationRef = doc(collection(db, 'notifications'));
              const notificationData = {
                userId: order.userId,
                title: "Order Ready for Pickup!",
                message: `Your order #${order.orderNumber} is now ready for pickup.`,
                orderNumber: order.orderNumber,
                timestamp: new Date(),
                status: "unread",
                timeslot: order.timeslot || "N/A"
              };
              batch.set(notificationRef, notificationData);

              // Commit the batch so that all operations happen atomically
              await batch.commit();
              Alert.alert('Success', 'Order moved to prepared orders and notification created!');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
          style: 'default'
        }
      ]
    );
  };

  const renderOrder = ({ item }) => {
    // Extract names from the items array
    const itemNames = Array.isArray(item.items)
      ? item.items.map(orderItem => orderItem.name).join(', ')
      : 'No items';

    return (
      <TouchableOpacity style={styles.orderContainer} onPress={() => handleMarkPrepared(item)}>
        <Text style={styles.orderText}>Order ID: {item.id}</Text>
        <Text style={styles.orderText}>Order Number: {item.orderNumber || 'N/A'}</Text>
        <Text style={styles.orderText}>Timeslot: {item.timeslot || 'N/A'}</Text>
        <Text style={styles.orderText}>Items: {itemNames}</Text>
        <Text style={styles.priceText}>
          P{item.totalCost ? item.totalCost.toFixed(2) : '0.00'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No pending orders</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
        />
      )}
    </View>
  );
};

export default PendingOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fdf5e6', // Cream background
  },
  noOrdersText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: '#003B6F', // Blue text
  },
  orderContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#003B6F', // Blue border for consistency
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fdf5e6', // Cream background
    position: 'relative', // To position the price absolutely
  },
  orderText: {
    fontSize: 16,
    marginVertical: 2,
    color: '#003B6F', // Blue text
  },
  // Price locked to bottom right
  priceText: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    fontSize: 20,      // Bigger font size
    fontWeight: 'bold',
    color: '#003B6F',  // Blue text
  },
});
