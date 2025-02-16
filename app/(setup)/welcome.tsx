import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as Battery from 'expo-battery';

export default function SetupWelcomeScreen() {
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

    // Fetch battery level on component mount
    useEffect(() => {
        const getBatteryLevel = async () => {
            const level = await Battery.getBatteryLevelAsync();
            setBatteryLevel(level ? Math.round(level * 100) : null); // Convert to percentage
        };

        getBatteryLevel();
    }, []);

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-4xl my-4">Welcome Screen!</Text>

            {/* 🔋 Battery Status Display */}
            <Text className="text-lg my-2 text-gray-700">
                🔋 Battery: {batteryLevel !== null ? `${batteryLevel}%` : "Loading..."}
            </Text>

            <View className="flex items-center justify-center gap-y-4">
                <Pressable onPress={() => router.push('/(root)/(admin)/admin')} className="bg-blue-500 p-4 rounded-xl">
                    <Text className="text-white text-2xl">Admin Route</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/(root)/(client)/clientConfirm')} className="bg-yellow-500 p-4 rounded-xl">
                    <Text className="text-white text-2xl">Client Route</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/(root)/(handler)/handlerConfirm')} className="bg-red-500 p-4 rounded-xl">
                    <Text className="text-white text-2xl">Handler Route</Text>
                </Pressable>
            </View>
        </View>
    );
}