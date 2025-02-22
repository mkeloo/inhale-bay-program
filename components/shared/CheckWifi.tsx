import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function WifiStrengthChecker() {
    const [wifiDetails, setWifiDetails] = useState({
        strength: 'N/A',
        ipAddress: 'N/A',
        connectionType: 'unknown',
        isConnected: false,
        cellularGeneration: 'N/A',
        carrier: 'N/A',
    });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected) {
                // Only attempt to access strength if the connection is wifi and the property exists.
                const strengthValue: number | null =
                    state.type === 'wifi' &&
                        state.details &&
                        'strength' in state.details
                        ? (state.details as { strength?: number }).strength ?? null
                        : null;
                const strengthText = getSignalStrengthLabel(strengthValue);

                setWifiDetails({
                    connectionType: state.type,
                    isConnected: state.isConnected,
                    strength: state.type === 'wifi'
                        ? `${strengthValue ?? "N/A"} dBm (${strengthText})`
                        : "N/A",
                    ipAddress:
                        state.details &&
                            typeof state.details === 'object' &&
                            'ipAddress' in state.details
                            ? (state.details as { ipAddress?: string }).ipAddress ?? "N/A"
                            : "N/A",
                    cellularGeneration: state.type === 'cellular' ? state.details?.cellularGeneration || "Unknown" : "N/A",
                    carrier: state.type === 'cellular' ? state.details?.carrier || "Unknown" : "N/A",
                });
            } else {
                setWifiDetails({
                    strength: "N/A",
                    ipAddress: "N/A",
                    connectionType: "none",
                    isConnected: false,
                    cellularGeneration: "N/A",
                    carrier: "N/A",
                });
            }
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    // Function to translate dBm to signal strength labels in layman's terms
    const getSignalStrengthLabel = (dBm: number | null) => {
        if (dBm === null) return "N/A";
        if (dBm >= -50) return "Excellent 🚀";
        if (dBm >= -60) return "Good 👍";
        if (dBm >= -70) return "Fair ⚖️";
        if (dBm >= -80) return "Weak ⚠️";
        return "Very Poor ❌";
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📡 Network Details:</Text>
            <Text>🔗 Connection Type: {wifiDetails.connectionType}</Text>
            <Text>✅ Connected: {wifiDetails.isConnected ? "Yes" : "No"}</Text>
            {wifiDetails.connectionType === 'wifi' && (
                <>
                    <Text>📡 Signal Strength: {wifiDetails.strength}</Text>
                    <Text>🌍 IP Address: {wifiDetails.ipAddress}</Text>
                </>
            )}
            {wifiDetails.connectionType === 'cellular' && (
                <>
                    <Text>📱 Cellular: {wifiDetails.cellularGeneration}</Text>
                    <Text>🏢 Carrier: {wifiDetails.carrier}</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        margin: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    }
});