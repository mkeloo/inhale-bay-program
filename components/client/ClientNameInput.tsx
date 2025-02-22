import { View, Text, TouchableOpacity, Animated, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import PredictiveNameStrip from '@/components/shared/PredictiveNameStrip';
import { searchNames } from '@/lib/namesAPI';

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
            try {
                const results = await searchNames(inputValue);
                // Convert NameEntry objects to an array of names
                setPredictions(results.map(result => result.name));
            } catch (error) {
                console.error('Error fetching predictions:', error);
                setPredictions([]);
            }
        };

        // Debounce the API call by 300ms
        const timeoutId = setTimeout(() => {
            fetchPredictions();
        }, 100);

        // Clean up the timeout if inputValue changes before the delay
        return () => clearTimeout(timeoutId);
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
                    setInputValue(name); // updates inputValue in the parent
                }}
            />
        </View>
    );
}