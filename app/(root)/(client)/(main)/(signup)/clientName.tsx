import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Space } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BackButton from '@/components/shared/BackButton';
import Stepper from '@/components/client/Stepper';
import ClientNameInput from '@/components/client/ClientNameInput';

export default function ClientNameScreen() {
    const [inputValue, setInputValue] = useState('');
    const deleteInterval = useRef<NodeJS.Timeout | null>(null); // Ref for tracking deletion loop

    const [timer, setTimer] = useState(500);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    handleEnter(); // Auto-submit when timer reaches 0
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Animation values for input scaling and opacity
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.5);

    // Reanimated styles
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

    // Handle Key Press
    const handlePress = (char: string) => {
        setInputValue((prev) => {
            const formatted = prev + char;
            return formatted
                .split(' ') // Split into words
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
                .join(' '); // Join back into string
        });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Trigger animation when text is added
        scale.value = withTiming(1.05, { duration: 200 });
        opacity.value = withTiming(1, { duration: 200 });

        setTimeout(() => {
            scale.value = withTiming(1, { duration: 200 });
        }, 200);
    };

    // 🔹 Single Tap Delete
    const handleSingleDelete = () => {
        setInputValue((prev) => prev.slice(0, -1));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // 🔹 Start Holding to Delete
    const startDeleting = () => {
        // Wait 300ms before starting repeat delete
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
            }, 100); // Deletes every 100ms
        }, 300); // Initial delay to prevent instant double delete
    };

    // 🔹 Stop Holding
    const stopDeleting = () => {
        if (deleteInterval.current) {
            clearInterval(deleteInterval.current);
            deleteInterval.current = null;
        }
    };

    // Handle Enter
    const handleEnter = () => {
        // Wrap navigation in setTimeout to defer it until after the render cycle
        setTimeout(() => {
            router.push('/(root)/(client)/(main)/(signup)/clientAvatar');
            // router.push('/welcome');

        }, 0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-900 p-5 relative">
            {/* Back Button */}
            <BackButton />

            <View className='w-full h-[20%] flex items-center justify-center pt-6'>
                {/* Stepper - Static UI */}
                <Stepper type='name' />


                <Text className="text-white text-6xl font-bold">Enter Your Name</Text>
            </View>


            {/* Refactored Name Input Field with Predictive Text */}
            <ClientNameInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                animatedStyle={animatedStyle}
            />

            {/* Keyboard Layout */}
            <View className="w-full h-[60%] flex items-center justify-start pt-12 ">
                {qwertyRows.map((row, rowIndex) => (
                    <View
                        key={rowIndex}
                        className="flex-row mb-1.5"
                        style={{
                            justifyContent: 'center',
                            gap: 8, // Space between keys
                            marginLeft: rowIndex === 10 ? 30 : rowIndex === 2 ? -65 : 0, // Shift rows for correct alignment
                        }}
                    >
                        {row.map((char) => (
                            <TouchableOpacity
                                key={char}
                                onPress={() => handlePress(char)}
                                className="w-[70px] h-[70px] bg-blue-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <Text className="text-[40px] font-bold text-white">{char}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Bottom Row: Delete | Space | Enter */}
                {/* Spacebar - Full Row */}
                <View className="w-full items-center justify-center">
                    <View className="w-60 flex-row justify-center">
                        <TouchableOpacity
                            onPress={() => handlePress(' ')}
                            className="w-full h-[60px] bg-blue-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                        >
                            <View className="flex items-center justify-center pb-6">
                                <Space size={55} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Delete & Submit - Equal Width */}
                    <View className="flex-row gap-x-6 mt-6 w-full max-w-xl">
                        {/* Delete Button */}
                        <TouchableOpacity
                            onPress={handleSingleDelete}
                            onPressIn={startDeleting}
                            onPressOut={stopDeleting}
                            className="flex-1 h-20 bg-red-600 rounded-lg flex-row items-center justify-center active:scale-95 transition-transform"
                        >
                            <Eraser size={30} color="white" />
                            <Text className="text-white font-bold text-3xl uppercase text-center ml-2">Delete</Text>
                        </TouchableOpacity>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleEnter}
                            className="flex-1 h-20 bg-green-600 rounded-lg flex-row items-center justify-center gap-x-3"
                        >
                            <Text className="text-white font-bold text-3xl uppercase text-center">Submit</Text>
                            <Text className="text-white text-2xl font-bold opacity-70">({timer}s)</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}