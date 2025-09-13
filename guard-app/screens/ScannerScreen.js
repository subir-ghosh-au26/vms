import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// We only need expo-camera now
import { CameraView, useCameraPermissions } from 'expo-camera';
import api from '../api';

export default function ScannerScreen({ navigation }) {
    // Use the modern hook for permissions
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => {
                        Alert.alert(
                            "Logout", "Are you sure you want to log out?",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "OK", onPress: async () => {
                                        await AsyncStorage.removeItem('user_token');
                                        navigation.replace('Login');
                                    }
                                }
                            ]
                        );
                    }}
                    title="Logout"
                    color="#e74c3c"
                />
            ),
        });
    }, [navigation]);

    // This function handles the barcode scanning event.
    // Note: The data structure is slightly different: `barcodes` is an array.
    const handleBarcodeScanned = ({ barcodes }) => {
        if (barcodes.length > 0 && !scanned) {
            setScanned(true); // Prevent multiple scans
            const scannedData = barcodes[0].data; // Get the data from the first scanned code
            console.log(`Scanned QR Code: ${scannedData}`);

            // Send data to the backend
            verifyData(scannedData);
        }
    };

    const verifyData = async (data) => {
        try {
            const response = await api.post('/scan/verify', {
                qr_code_id: data,
                gate_number: 'Main Gate',
            });
            navigation.replace('Result', { result: response.data });
        } catch (error) {
            const errorData = error.response ? error.response.data : { status: 'ERROR', message: 'Could not connect to the server.' };
            navigation.replace('Result', { result: errorData });
        }
    };

    // Render UI based on permission status.
    if (!permission) {
        // Permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Permissions have not been granted yet
        return (
            <View style={styles.permissionContainer}>
                <Text style={{ textAlign: 'center', marginBottom: 10 }}>We need your permission to use the camera scanner.</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    // If permission is granted, render the camera view.
    return (
        <View style={styles.container}>
            <CameraView
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"], // We only care about QR codes
                }}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
                <View style={styles.rescanButton}>
                    <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
                </View>
            )}
        </View>
    );
}

// Styles for the component.
const styles = StyleSheet.create({
    container: { flex: 1 },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    rescanButton: { position: 'absolute', bottom: 50, left: 20, right: 20 }
});