import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { CameraView as Camera, useCameraPermissions } from 'expo-camera'; // Import the hook
import api from '../api';

export default function ScannerScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions(); // Use the hook
    const [scanned, setScanned] = useState(false);

    // This will show a loading screen until the permission status is determined.
    if (!permission) {
        return <View />;
    }

    // This will show if permission has not been granted yet.
    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const handleBarCodeScanned = async ({ data }) => {
        // ... (rest of the code is the same as before)
        setScanned(true);
        try {
            const response = await api.post('/scan/verify', { qr_code_id: data, gate_number: 'Mobile App Scan' });
            navigation.replace('Result', { result: response.data });
        } catch (error) {
            const errorData = error.response ? error.response.data : { status: 'ERROR', message: 'Could not connect to server.' };
            navigation.replace('Result', { result: errorData });
        }
    };

    // If we get here, it means permission is granted.
    return (
        <View style={styles.container}>
            <Camera
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
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

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    rescanButton: { position: 'absolute', bottom: 50, left: 20, right: 20 }
});