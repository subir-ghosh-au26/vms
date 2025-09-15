import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import api from '../api';

export default function ScannerScreen({ navigation }) {
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

    // --- THE FIX IS IN THIS FUNCTION ---
    const handleBarcodeScanned = (scanningResult) => {
        if (!scanned) {
            // The new structure provides the data directly on the result object
            const { data } = scanningResult;

            // Check if data is not null or empty
            if (data) {
                setScanned(true); // Prevent multiple scans
                console.log(`Scanned QR Code: ${data}`);
                verifyData(data);
            }
        }
    };

    const verifyData = async (data) => {
        let resultData;
        try {
            const response = await api.post('/scan/verify', {
                qr_code_id: data,
                gate_number: 'Main Gate',
            });
            resultData = response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                resultData = error.response.data;
            } else {
                resultData = { status: 'ERROR', message: 'A network error occurred.' };
            }
        }
        navigation.replace('Result', { result: resultData });
    };

    // Render UI based on permission status.
    if (!permission) {
        return <View />; // Permissions are still loading
    }

    if (!permission.granted) {
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
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
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