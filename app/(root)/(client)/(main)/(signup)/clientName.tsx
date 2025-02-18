import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Space, Check, MapPin, CheckCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BackButton from '@/components/shared/BackButton';

export default function ClientNameScreen() {
    const [inputValue, setInputValue] = useState('');
    const deleteInterval = useRef<NodeJS.Timeout | null>(null); // Ref for tracking deletion loop

    const [timer, setTimer] = useState(20);

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
        setInputValue((prev) => prev + char);
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
        router.push('/(root)/(client)/(main)/(signup)/clientAvatar');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-900 p-5 relative">

            {/* Back Button */}
            <BackButton />

            {/* Stepper - Static UI */}
            <View className="flex-row items-center justify-center mb-10 gap-x-4">
                {/* Step 1 - Always Checked */}
                <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Check size={24} color="black" />
                </View>
                <View className="w-12 h-1 bg-white" />

                {/* Step 2 - Active Step */}
                <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Text className="text-black text-xl font-bold">2</Text>
                </View>
                <View className="w-12 h-1 bg-white" />

                {/* Step 3 - Inactive */}
                <View className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <Text className="text-gray-400 text-xl font-bold">3</Text>
                </View>
                <View className="w-12 h-1 bg-white" />

                {/* Final Destination */}
                <View className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
                    <CheckCheck size={24} color="white" />
                </View>
            </View>

            <Text className="text-white text-5xl font-bold mb-4">Enter Your Name</Text>

            {/* Input Field (No System Keyboard) */}
            <TouchableOpacity activeOpacity={1} className="w-[60%] p-3 bg-gray-800 rounded-lg">
                <Animated.View style={animatedStyle}>
                    <TextInput
                        value={inputValue}
                        editable={false} // Prevent system keyboard
                        className="text-white text-2xl text-center"
                    />
                </Animated.View>
            </TouchableOpacity>

            {/* Keyboard Layout */}
            <View className="mt-6 items-center">
                {qwertyRows.map((row, rowIndex) => (
                    <View
                        key={rowIndex}
                        className="flex-row mb-3"
                        style={{
                            justifyContent: 'center',
                            gap: 8, // Space between keys
                            marginLeft: rowIndex === 1 ? 20 : rowIndex === 2 ? 40 : 0, // Shift rows for correct alignment
                        }}
                    >
                        {row.map((char) => (
                            <TouchableOpacity
                                key={char}
                                onPress={() => handlePress(char)}
                                className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <Text className="text-2xl font-bold text-white">{char}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Bottom Row: Delete | Space | Enter */}
                {/* Spacebar - Full Row */}
                <View className='w-full items-center justify-center'>
                    <View className="w-60 flex-row justify-center">
                        <TouchableOpacity
                            onPress={() => handlePress(' ')}
                            className="w-3/4 h-12 bg-blue-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                        >
                            <Text className="text-2xl font-bold text-white">
                                <Space size={30} color="white" />
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Delete & Submit - Equal Width */}
                    <View className="flex-row gap-x-6 mt-6 w-full max-w-xl">
                        {/* Delete Button */}
                        <TouchableOpacity
                            onPress={handleSingleDelete}
                            onPressIn={startDeleting}
                            onPressOut={stopDeleting}
                            className="flex-1 h-16 bg-red-600 rounded-lg flex-row items-center justify-center active:scale-95 transition-transform"
                        >
                            <Eraser size={30} color="white" />
                            <Text className="text-white font-bold text-2xl uppercase text-center ml-2">Delete</Text>
                        </TouchableOpacity>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleEnter}
                            className="flex-1 h-16 bg-green-600 rounded-lg flex-row items-center justify-center gap-x-3"
                        >
                            <Text className="text-white font-bold text-2xl uppercase text-center">Submit</Text>
                            <Text className="text-white text-xl font-bold opacity-70">({timer}s)</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>
    );
}