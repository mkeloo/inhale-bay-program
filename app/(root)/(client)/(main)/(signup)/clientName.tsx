import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Space } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BackButton from '@/components/shared/BackButton';
import Stepper from '@/components/client/Stepper';
import ClientNameInput from '@/components/client/ClientNameInput';
import { useCustomerStore } from '@/stores/customerStore'; // Import Zustand store


export default function ClientNameScreen() {
    const [inputValue, setInputValue] = useState('');
    const deleteInterval = useRef<NodeJS.Timeout | null>(null); // For deletion loop
    const [timer, setTimer] = useState(35);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Zustand store function
    const setCustomerData = useCustomerStore((state) => state.setCustomerData);

    // Start countdown timer and store in intervalRef
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    handleEnter(); // Auto-submit when timer reaches 0
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Animation values for input scaling and opacity
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    // QWERTY Layout
    const qwertyRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ];

    // Handle key press
    const handlePress = (char: string) => {
        setInputValue((prev) => {
            const formatted = prev + char;
            return formatted
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        scale.value = withTiming(1.05, { duration: 200 });
        opacity.value = withTiming(1, { duration: 200 });

        setTimeout(() => {
            scale.value = withTiming(1, { duration: 200 });
        }, 200);
    };

    // Single tap delete
    const handleSingleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // Start holding to delete
    const startDeleting = () => {
        deleteInterval.current = setTimeout(() => {
            deleteInterval.current = setInterval(() => {
                setInputValue((prev) => {
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

    // Stop holding delete
    const stopDeleting = () => {
        if (deleteInterval.current) {
            clearInterval(deleteInterval.current);
            deleteInterval.current = null;
        }
    };

    // Handle Enter (Submit)
    // const handleEnter = () => {
    //     if (intervalRef.current) {
    //         clearInterval(intervalRef.current);
    //         intervalRef.current = null;
    //     }
    //     setTimeout(() => {
    //         router.push('/(root)/(client)/(main)/(signup)/clientAvatar');
    //     }, 0);
    //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // };

    // Handle Enter (Submit)
    const handleEnter = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (inputValue.trim().length > 0) {
            // Save name in Zustand store
            setCustomerData({ name: inputValue });

            // Navigate to next screen
            router.push('/(root)/(client)/(main)/(signup)/clientAvatar');

            // Success Haptic Feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-900 p-5 relative">
            {/* Back Button */}
            <BackButton />

            <View className="w-full h-[20%] flex items-center justify-center pt-6">
                {/* Stepper - Static UI */}
                <Stepper type="name" />
                <Text className="text-white text-6xl font-bold">Enter Your Name</Text>
            </View>

            {/* Name Input Field */}
            <ClientNameInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                animatedStyle={animatedStyle}
            />

            {/* Keyboard Layout */}
            <View className="w-full h-[60%] flex items-center justify-start pt-12">
                {qwertyRows.map((row, rowIndex) => (
                    <View
                        key={rowIndex}
                        className="flex-row mb-1.5"
                        style={{
                            justifyContent: 'center',
                            gap: 8,
                            marginLeft: rowIndex === 10 ? 30 : rowIndex === 2 ? -65 : 0,
                        }}
                    >
                        {row.map((char) => (
                            <TouchableOpacity
                                key={char}
                                onPress={() => handlePress(char)}
                                className="w-[70px] h-[70px] bg-blue-600 rounded-lg flex items-center justify-center"
                            >
                                <Text className="text-[40px] font-bold text-white">{char}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Bottom Row: Delete, Space, Submit */}
                <View className="w-full items-center justify-center">
                    <View className="w-60 flex-row justify-center">
                        <TouchableOpacity
                            onPress={() => handlePress(' ')}
                            className="w-full h-[60px] bg-blue-600 rounded-lg flex items-center justify-center"
                        >
                            <View className="flex items-center justify-center pb-6">
                                <Space size={55} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row gap-x-6 mt-6 w-full max-w-xl">
                        {/* Delete Button */}
                        <TouchableOpacity
                            onPress={handleSingleDelete}
                            onPressIn={startDeleting}
                            onPressOut={stopDeleting}
                            className="flex-1 h-20 bg-red-600 rounded-lg flex-row items-center justify-center"
                        >
                            <Eraser size={30} color="white" />
                            <Text className="text-white font-bold text-3xl uppercase text-center ml-2">
                                Delete
                            </Text>
                        </TouchableOpacity>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleEnter}
                            className="flex-1 h-20 bg-green-600 rounded-lg flex-row items-center justify-center gap-x-3"
                        >
                            <Text className="text-white font-bold text-3xl uppercase text-center">
                                Submit
                            </Text>
                            <Text className="text-white text-2xl font-bold opacity-70">
                                ({timer}s)
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}