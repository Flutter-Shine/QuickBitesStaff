// screens/PreparedOrdersScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const PreparedOrdersScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'preparedOrders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  const handleCancelOrder = (order) => {
    Alert.alert(
      'Cancel Order?',
      'Do you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: async () => {
            try {
              const batch = writeBatch(db);

              // Reference for new document in canceledOrder collection
              const canceledRef = doc(collection(db, 'canceledOrder'));
              // Prepare data: update status to "canceled"
              const canceledData = { ...order, status: 'canceled' };
              // Remove the id property since it will be auto-generated in canceledOrder
              delete canceledData.id;
              batch.set(canceledRef, canceledData);

              // Delete the document from preparedOrders
              const preparedRef = doc(db, 'preparedOrders', order.id);
              batch.delete(preparedRef);

              // Create a notification in the notifications collection
              const notificationRef = doc(collection(db, 'notifications'));
              const notificationData = {
                userId: order.userId,
                title: "Order Canceled",
                message: `Your order #${order.orderNumber} has been canceled.`,
                orderNumber: order.orderNumber,
                timestamp: new Date(),
                status: "unread"
              };
              batch.set(notificationRef, notificationData);

              await batch.commit();
              Alert.alert('Success', 'Order canceled and notification sent!');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderOrder = ({ item }) => {
    // Extract item names from the items array (each element is a map)
    const itemNames = Array.isArray(item.items)
      ? item.items.map(orderItem => orderItem.name).join(', ')
      : 'No items';

    return (
      <TouchableOpacity 
        style={styles.orderContainer} 
        onPress={() => handleCancelOrder(item)}
      >
        <Text style={styles.orderText}>Order Number: {item.orderNumber || 'N/A'}</Text>
        <Text style={styles.orderText}>Order ID: {item.id}</Text>
        <Text style={styles.orderText}>Timeslot: {item.timeslot || 'N/A'}</Text>
        <Text style={styles.orderText}>Items: {itemNames}</Text>
        <Text style={styles.orderText}>
          Total Cost: ${item.totalCost ? item.totalCost.toFixed(2) : '0.00'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No prepared orders</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noOrdersText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 16,
  },
  orderContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  orderText: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default PreparedOrdersScreen;
