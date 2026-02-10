// screens/CompletedOrdersScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const CompletedOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Set header options: navy header with cream title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Completed Orders',
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#003B6F' },
      headerTitleStyle: { color: '#fdf5e6', fontSize: 22, fontWeight: 'bold' },
    });
  }, [navigation]);

  useEffect(() => {
    // Calculate the date from 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const unsubscribe = onSnapshot(collection(db, 'completedOrders'), (snapshot) => {
      const ordersData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(order => {
          // Filter for orders within the last 7 days
          const orderTime = order.createdAt?.toDate?.() || new Date(order.createdAt);
          return orderTime >= sevenDaysAgo;
        })
        .sort((a, b) => {
          // Sort by createdAt descending (newest first)
          const timeA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const timeB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return timeB - timeA;
        });
      
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderOrder = ({ item }) => {
    const isExpanded = expandedId === item.id;
    
    // Extract names and quantities from the items array
    const itemDetails = Array.isArray(item.items)
      ? item.items.map(orderItem => `${orderItem.name} (x${orderItem.quantity || 1})`).join(', ')
      : 'No items';

    return (
      <TouchableOpacity 
        style={styles.orderContainer}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <Text style={styles.orderText}>Order #: {item.orderNumber || 'N/A'}</Text>
        <Text style={styles.orderText}>Items: {itemDetails}</Text>
        <Text style={styles.orderText}>Date: {formatDate(item.createdAt)}</Text>
        <Text style={styles.priceText}>Price: P{item.totalCost ? item.totalCost.toFixed(2) : '0.00'}</Text>
        
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.orderText}>Order ID: {item.id}</Text>
            <Text style={styles.orderText}>Timeslot: {item.timeslot || 'N/A'}</Text>
            <Text style={styles.orderText}>Time Completed: {formatTime(item.createdAt)}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No completed orders in the last 7 days</Text>
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

export default CompletedOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fdf5e6', // Cream background
  },
  noOrdersText: {
    fontSize: 26,
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
  },
  orderText: {
    fontSize: 20,
    marginVertical: 2,
    color: '#003B6F', // Blue text
  },
  priceText: {
    fontSize: 20,
    marginVertical: 2,
    fontWeight: 'bold',
    color: '#003B6F', // Blue text
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#003B6F',
  },
});
