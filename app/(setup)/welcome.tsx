import { View, Text, Pressable, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import BatteryStatus from '@/components/shared/BatteryLevel';
import WifiStrengthChecker from '@/components/shared/CheckWifi';
import { fetchUserTypes, UserType } from '@/utils/actions';

export default function SetupWelcomeScreen() {
    const [userTypes, setUserTypes] = useState<UserType[]>([]);

    useEffect(() => {
        const loadUserTypes = async () => {
            const fetchedUserTypes = await fetchUserTypes();
            setUserTypes(fetchedUserTypes);
        };

        loadUserTypes();
    }, []);

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-4xl my-4">Welcome Screen!</Text>

            {/* 🔋 Battery Status Display */}
            <BatteryStatus />

            {/* 📶 WiFi Strength Checker */}
            <WifiStrengthChecker />

            <View className="w-full flex flex-row items-center justify-center gap-x-20">
                {/* Navigation Buttons */}
                <View className="flex items-center justify-center gap-y-4 mt-6">
                    <Pressable onPress={() => router.push('/(root)/(admin)/admin')} className="bg-blue-500 p-4 rounded-xl">
                        <Text className="text-white text-2xl">Admin Route</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push('/(root)/(client)/(main)/(signup)/clientPhone')} className="bg-yellow-500 p-4 rounded-xl">
                        <Text className="text-white text-2xl">Client Route</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push('/(root)/(handler)/handlerConfirm')} className="bg-red-500 p-4 rounded-xl">
                        <Text className="text-white text-2xl">Handler Route</Text>
                    </Pressable>
                </View>

                {/* 🗂️ Display Fetched User Types */}
                <View className="mt-6">
                    <Text className="text-2xl font-bold">User Types:</Text>
                    <FlatList
                        data={userTypes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View className="p-2 border-b border-gray-300">
                                <Text className="text-lg font-bold">{item.user_type_name}</Text>
                                <Text className="text-gray-600">{item.description}</Text>
                            </View>
                        )}
                    />
                </View>
            </View>
        </View>
    );
}