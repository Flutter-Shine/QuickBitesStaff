import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Camera } from "expo-camera";
import { doc, getDoc, writeBatch, collection } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default function ScanScreen() {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");

  // Use object destructuring for camera permissions
  const { granted } = useCameraPermissions();
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Manually request camera permission on mount
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setPermissionGranted(true);
      }
    })();
  }, []);

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Button
          title="Grant Permission"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status === "granted") {
              setPermissionGranted(true);
            }
          }}
        />
      </View>
    );
  }

  // Called when a barcode is scanned
  async function handleBarcodeScanned({ type, data }) {
    setScanned(true);
    setScannedData(data);
    try {
      // Assume scanned data is the Order ID.
      const preparedOrderRef = doc(db, "preparedOrders", data);
      const orderSnap = await getDoc(preparedOrderRef);
  
      if (orderSnap.exists()) {
        const batch = writeBatch(db);
        const orderData = orderSnap.data();
        // Update status to "completed"
        orderData.status = "completed";
        
        // Create new document in completedOrders
        const completedOrderRef = doc(collection(db, "completedOrders"));
        batch.set(completedOrderRef, orderData);
        
        // Delete the document from preparedOrders
        batch.delete(preparedOrderRef);
        
        // Prepare a string listing all order items (assumes each item has a 'name' field)
        const orderItemsString = orderData.items && Array.isArray(orderData.items)
          ? orderData.items.map(item => item.name).join(", ")
          : "No items";
        
        // Create a notification in the notifications collection
        const notificationRef = doc(collection(db, "notifications"));
        const notificationData = {
          userId: orderData.userId,
          title: "Order Completed",
          message: `Your order #${orderData.orderNumber} with items ${orderItemsString} has been completed.`,
          orderNumber: orderData.orderNumber,
          timestamp: new Date(),
          status: "unread"
        };
        batch.set(notificationRef, notificationData);
        
        // Commit the batch atomically
        await batch.commit();
        Alert.alert(
          "Order Completed",
          `Order #${orderData.orderNumber || "N/A"} has been moved to completed orders.`
        );
      } else {
        Alert.alert("Order Not Prepared", "The order is not yet prepared.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={[StyleSheet.absoluteFillObject, { transform: [{ scaleX: -1 }] }]}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      >
        {scanned && (
          <View style={styles.rescanButton}>
            <Button
              title="Scan Again"
              onPress={() => {
                setScanned(false);
                setScannedData("");
              }}
            />
          </View>
        )}
      </CameraView>
      {scannedData ? (
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>Scanned Data: {scannedData}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  rescanButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
  dataContainer: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dataText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
