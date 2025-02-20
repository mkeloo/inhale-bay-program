import { View, Text } from 'react-native';
import React from 'react';
import { Check, CheckCheck } from 'lucide-react-native';

export default function Stepper({ type }: { type: 'name' | 'avatar' }) {
    return (
        <View className="w-full flex-row items-center justify-center mb-12 gap-x-4">
            {/* Step 1 - Always Checked */}
            <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Check size={24} color="black" />
            </View>
            <View className="w-32 h-1 bg-white" />

            {/* Step 2 - Conditional (Checked or Number) */}
            <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                {type === 'name' ? (
                    <Text className="text-black text-xl font-bold">2</Text>
                ) : (
                    <Check size={24} color="black" />
                )}
            </View>
            <View className="w-32 h-1 bg-white" />

            {/* Step 3 - Conditional (Inactive or Active) */}
            <View
                className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'name' ? 'bg-gray-600' : 'bg-white'
                    }`}
            >
                <Text
                    className={`text-xl font-bold ${type === 'name' ? 'text-gray-400' : 'text-black'
                        }`}
                >
                    3
                </Text>
            </View>
            <View className="w-32 h-1 bg-white" />

            {/* Final Destination */}
            <View className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
                <CheckCheck size={24} color="white" />
            </View>
        </View>
    );
}