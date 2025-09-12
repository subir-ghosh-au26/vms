// guard-app/screens/ResultScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export default function ResultScreen({ route, navigation }) {
    const { result } = route.params;

    // For debugging: This will print the exact data received to your terminal.
    useEffect(() => {
        console.log("Data received on Result Screen:", JSON.stringify(result, null, 2));
    }, [result]);

    const isApproved = result.status?.startsWith('APPROVED');
    const backgroundColor = isApproved ? '#27ae60' : '#c0392b';
    const statusText = result.status?.replace('_', ' ') || 'REJECTED';
    const vehicle = result.vehicle;

    // --- NEW LOGIC TO DETERMINE DEPARTMENT NAME ---
    let departmentDisplayName = 'N/A';
    if (vehicle) {
        if (vehicle.type === 'DEPT_CAR') {
            departmentDisplayName = vehicle.vehicle_department || 'N/A';
        } else {
            departmentDisplayName = vehicle.employee_department || 'N/A';
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>

            {isApproved && vehicle && (
                <View style={styles.detailsContainer}>
                    {/* Vehicle Number */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Vehicle No:</Text>
                        <Text style={styles.detailValue}>{vehicle.vehicle_number || 'N/A'}</Text>
                    </View>

                    {/* Owner (only show for personal vehicles) */}
                    {vehicle.type !== 'DEPT_CAR' && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Owner:</Text>
                            <Text style={styles.detailValue}>{vehicle.owner_name || 'N/A'}</Text>
                        </View>
                    )}

                    {/* Department (ALWAYS show, but use our new logic) */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Department:</Text>
                        <Text style={styles.detailValue}>{departmentDisplayName}</Text>
                    </View>
                </View>
            )}

            {!isApproved && result.message && (
                <Text style={styles.messageText}>{result.message}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Scanner')}>
                <Text style={styles.buttonText}>SCAN ANOTHER</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'space-around', padding: 20 },
    statusText: { fontSize: 40, fontWeight: 'bold', color: 'white', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
    detailsContainer: { backgroundColor: 'rgba(0,0,0,0.25)', padding: 20, borderRadius: 10, alignSelf: 'stretch' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    detailLabel: { fontSize: 18, color: '#f0f0f0', fontWeight: 'bold' },
    detailValue: { fontSize: 18, color: 'white' },
    messageText: { fontSize: 20, color: 'white', textAlign: 'center' },
    button: { backgroundColor: '#3498db', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 8, elevation: 3 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});