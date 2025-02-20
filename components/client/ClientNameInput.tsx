import { View, Text, TouchableOpacity, Animated, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import PredictiveNameStrip from '@/components/shared/PredictiveNameStrip';
import { searchNames } from '@/lib/asyncStorage';

interface ClientNameInputProps {
    inputValue: string;          // controlled by a parent
    setInputValue: (value: string) => void;  // also from parent
    animatedStyle: any;
}

export default function ClientNameInput({
    inputValue,
    setInputValue,
    animatedStyle
}: ClientNameInputProps) {
    const [predictions, setPredictions] = useState<string[]>([]);

    useEffect(() => {
        const fetchPredictions = async () => {
            // search for names matching inputValue
            await searchNames(inputValue, (results) => {
                // console.log('searchNames returned:', results); // Debug
                setPredictions(results);
            });
        };
        fetchPredictions();
    }, [inputValue]);

    return (
        <View className="w-full h-[20%] items-center justify-center gap-y-3">
            {/* Name Input Field (NOT editable => no system keyboard) */}
            <TouchableOpacity activeOpacity={1} className="w-[60%] px-3 py-5 bg-gray-800 rounded-lg">
                <Animated.View style={animatedStyle}>
                    <TextInput
                        value={inputValue}
                        editable={false}    // <<--- keyboard off
                        className="text-white text-2xl text-center"
                    />
                </Animated.View>
            </TouchableOpacity>

            {/* Predictive Name Suggestions */}
            <PredictiveNameStrip
                predictions={predictions}
                onSelect={(name: string) => {
                    // console.log('User tapped:', name); // Debug
                    setInputValue(name); // updates inputValue in the parent
                }}
            />
        </View>
    );
}