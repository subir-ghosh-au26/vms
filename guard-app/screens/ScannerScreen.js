// guard-app/screens/ScannerScreen.js

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView as Camera } from 'expo-camera';
import api from '../api';

export default function ScannerScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    // This hook sets up the header button and contains all the logout logic.
    // Using useLayoutEffect ensures the header is configured before the screen is painted.
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => {
                        // Define the alert logic directly inside the onPress handler for reliability.
                        Alert.alert(
                            "Logout", // Title
                            "Are you sure you want to log out?", // Message
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log("Logout canceled"),
                                    style: "cancel"
                                },
                                {
                                    text: "OK",
                                    onPress: async () => {
                                        // Core logout action: remove token and navigate to Login screen.
                                        await AsyncStorage.removeItem('user_token');
                                        navigation.replace('Login');
                                    }
                                }
                            ]
                        );
                    }}
                    title="Logout"
                    color="#e74c3c" // A red color for the logout button
                />
            ),
        });
    }, [navigation]); // Dependency array ensures this runs if the navigation object changes.

    // This hook requests camera permission when the component mounts.
    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
            }
            setHasPermission(status === 'granted');
        };
        getCameraPermissions();
    }, []); // The empty array ensures this runs only once.

    // This function handles the QR code scanning event.
    const handleBarCodeScanned = async ({ data }) => {
        setScanned(true); // Prevent multiple scans in quick succession
        try {
            const response = await api.post('/scan/verify', {
                qr_code_id: data,
                gate_number: 'Mobile App Scan',
            });
            // Navigate to the Result screen on a successful API call.
            navigation.replace('Result', { result: response.data });
        } catch (error) {
            // Also navigate to the Result screen on an error to display the message.
            const errorData = error.response ? error.response.data : { status: 'ERROR', message: 'Could not connect to the server.' };
            navigation.replace('Result', { result: errorData });
        }
    };

    // Render different UI based on the permission status.
    if (hasPermission === true) {
        return (
            <View style={styles.centerTextContainer}>
                <Text>Requesting for camera permission...</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.centerTextContainer}>
                <Text>No access to camera. Please enable it in your phone's settings.</Text>
            </View>
        );
    }

    // If permission is granted, render the camera view.
    return (
        <View style={styles.container}>
            <Camera
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'], // Optimize for QR codes
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
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    centerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rescanButton: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
    }
});