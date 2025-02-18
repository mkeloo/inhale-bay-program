// BatteryStatus.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Battery from 'expo-battery';

export default function BatteryStatus() {
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

    useEffect(() => {
        const fetchBatteryLevel = async () => {
            const level = await Battery.getBatteryLevelAsync();
            setBatteryLevel(level);
        };
        fetchBatteryLevel();
    }, []);

    const percentage = batteryLevel !== null ? Math.round(batteryLevel * 100) : 0;

    return (
        <View style={styles.container}>
            <View style={styles.battery}>
                <View style={[styles.batteryFill, { width: `${percentage}%` }]} />
                <View style={styles.batteryTip} />
            </View>
            <Text style={styles.percentageText}>
                {batteryLevel !== null ? `${percentage}%` : "Loading..."}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    battery: {
        width: 100,
        height: 40,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    batteryFill: {
        height: '100%',
        backgroundColor: '#4caf50',
    },
    batteryTip: {
        position: 'absolute',
        right: -8,
        top: '25%',
        width: 6,
        height: '50%',
        backgroundColor: '#000',
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },
    percentageText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
});