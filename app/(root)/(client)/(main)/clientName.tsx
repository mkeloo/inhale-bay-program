import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import { Delete, BadgeCheck, Space } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BackButton from '@/components/shared/BackButton';

export default function ClientNameScreen() {
    const [inputValue, setInputValue] = useState('');
    const deleteInterval = useRef<NodeJS.Timeout | null>(null); // Ref for tracking deletion loop

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
        console.log('Entered:', inputValue);
        router.push('/(root)/(client)/(main)/clientAvatar');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-900 p-5 relative">

            {/* Back Button */}
            <BackButton />

            <Text className="text-white text-3xl font-bold mb-4">Enter Your Name</Text>

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
                <View className="flex-row gap-x-2 mt-1">
                    {/* Delete Button (Long Press Support) */}
                    <TouchableOpacity
                        onPress={handleSingleDelete} // Single tap deletes one character
                        onPressIn={startDeleting} // Start continuous deletion on press-hold
                        onPressOut={stopDeleting} // Stop deletion on release
                        className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <Delete size={28} color="white" />
                    </TouchableOpacity>

                    {/* Space Button */}
                    <TouchableOpacity
                        onPress={() => handlePress(' ')}
                        className="w-32 h-12 bg-blue-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <Text className="text-2xl font-bold text-white">
                            <Space size={28} color="white" />
                        </Text>
                    </TouchableOpacity>

                    {/* Enter Button */}
                    <TouchableOpacity
                        onPress={handleEnter}
                        className="w-16 h-12 bg-green-600 rounded-lg flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <BadgeCheck size={28} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}