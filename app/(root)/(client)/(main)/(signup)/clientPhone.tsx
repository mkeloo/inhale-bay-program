import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { X, BadgeCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useCustomerStore } from '@/stores/customerStore'; // Import Zustand store
import { fetchCustomerByPhone, fetchStoreIdByCode, sendClientHeartbeat } from '@/utils/actions'; // Import fetch functions
import { useFocusEffect } from '@react-navigation/native';


const STORE_CODE = "5751"; // Store code to track customers


export default function ClientPhoneScreen() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [storeId, setStoreId] = useState<string | null>(null);
    const deleteInterval = useRef<NodeJS.Timeout | null>(null);
    const setCustomerData = useCustomerStore((state) => state.setCustomerData);



    // ───────────────────────────────────────────────────────────
    // State & Effect Hook for Heartbeat (Only Active Screens)
    // ───────────────────────────────────────────────────────────
    useFocusEffect(
        React.useCallback(() => {
            if (!storeId) return;

            // Start heartbeat when screen is focused
            const interval = setInterval(() => {
                sendClientHeartbeat(storeId, "client_phone_screen", "📡 Sending heartbeat...");
            }, 5000);

            return () => {
                sendClientHeartbeat(storeId, "client_phone_screen", "❌ Stopping heartbeat...");
                clearInterval(interval);
            };
        }, [storeId])
    );


    // 🔍 Fetch store ID on mount
    useEffect(() => {
        const getStoreId = async () => {
            const id = await fetchStoreIdByCode(STORE_CODE);
            setStoreId(id);
        };
        getStoreId();
    }, []);


    // Handle number input with light haptic feedback and secret logic for "555555"
    const handlePress = (num: string) => {
        setPhoneNumber((prev) => {
            if (prev.length >= 10) return prev;
            const newPhone = prev + num;
            // Secret logic: if first six digits exactly equal "555555", route to admin screen
            if (newPhone.length === 6 && newPhone === "555555") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.push("/welcome");
                return ""; // Optionally reset phone number
            }
            return newPhone;
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // Handle delete button (single tap) with medium haptic feedback
    const handleDelete = () => {
        setPhoneNumber((prev) => prev.slice(0, -1));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // Start continuous deletion on long press
    const startDeleting = () => {
        deleteInterval.current = setTimeout(() => {
            deleteInterval.current = setInterval(() => {
                setPhoneNumber((prev) => {
                    if (prev.length === 0) {
                        clearInterval(deleteInterval.current!);
                        return prev;
                    }
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    return prev.slice(0, -1);
                });
            }, 100);
        }, 300);
    };

    // Stop continuous deletion
    const stopDeleting = () => {
        if (deleteInterval.current) {
            clearInterval(deleteInterval.current);
            deleteInterval.current = null;
        }
    };

    // Handle enter (submit)
    const handleEnter = async () => {
        if (phoneNumber.length === 10) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // 🔍 Check if customer exists
            const existingCustomer = await fetchCustomerByPhone(phoneNumber);

            if (existingCustomer) {
                // Existing customer → Set store data & redirect
                setCustomerData({
                    store_id: existingCustomer.store_id,
                    phone_number: existingCustomer.phone_number,
                    name: existingCustomer.name,
                    avatar_name: existingCustomer.avatar_name,
                });
                router.push("/(root)/(client)/(main)/clientDashboard");
            } else {
                // New customer → Assign store_id and continue registration
                setCustomerData({
                    store_id: storeId || "",
                    phone_number: phoneNumber,
                });
                router.push("/(root)/(client)/(main)/(signup)/clientName");
            }
        }
    };

    // Format phone number for display
    const formatPhoneNumber = (number: string) => {
        if (number.length <= 3) return `(${number}`;
        if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
        return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    };

    return (
        <View className="flex-1 flex-row bg-gray-900">
            {/* Left Side - Placeholder Image */}
            <View className="w-1/2">
                <Image
                    source={require("../../../../../assets/images/screen/home/home.jpg")}
                    className="w-full h-full object-cover"
                    resizeMode="cover"
                />
            </View>

            {/* Right Side - Input & Keypad */}
            <View className="w-1/2 flex items-center justify-center px-6">
                {/* Title */}
                <Text className="text-white text-4xl font-bold mb-6">
                    Enter Your Phone Number
                </Text>

                {/* Phone Input */}
                <View className="w-full max-w-sm bg-gray-800 rounded-lg px-4 py-3 border border-gray-600 mb-6">
                    <TextInput
                        value={
                            phoneNumber.length > 0
                                ? formatPhoneNumber(phoneNumber)
                                : "(904) 000-0000"
                        }
                        className={`text-3xl font-bold tracking-widest text-center ${phoneNumber.length > 0 ? "text-white" : "text-gray-500"
                            }`}
                        keyboardType="number-pad"
                        editable={false} // Prevent manual input; use keypad
                    />
                </View>

                {/* Keypad */}
                <View className="flex flex-row flex-wrap justify-center w-[240px] gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePress(num.toString())}
                            onLongPress={
                                num === 8
                                    ? () => {
                                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                        router.push("/(root)/(admin)/admin");
                                    }
                                    : undefined
                            }
                            delayLongPress={num === 8 ? 7000 : 500}
                            className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                        >
                            <Text className="text-3xl font-bold text-white">{num}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Last Row - Zero & Enter */}
                    <TouchableOpacity
                        onPress={handleDelete}
                        onPressIn={startDeleting}
                        onPressOut={stopDeleting}
                        className="w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <X size={32} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handlePress.bind(null, "0")}
                        className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <Text className="text-3xl font-bold text-white">0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleEnter}
                        disabled={phoneNumber.length < 10}
                        className={`w-20 h-20 rounded-xl flex items-center justify-center shadow-lg ${phoneNumber.length === 10 ? "bg-green-600" : "bg-gray-400 opacity-50"
                            }`}
                    >
                        <BadgeCheck size={40} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}