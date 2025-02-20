import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';

interface PredictiveNameStripProps {
    predictions: string[];
    onSelect: (name: string) => void;
}

export default function PredictiveNameStrip({
    predictions,
    onSelect
}: PredictiveNameStripProps) {
    // If no predictions, hide the strip
    // if (predictions.length === 0) return null;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="w-[60%] h-16 rounded-lg px-3 py-2 gap-x-2 flex-row flex items-center justify-center"
        >
            {predictions.map((name) => (
                <TouchableOpacity
                    key={name}
                    onPress={() => onSelect(name)}
                    className="px-4 py-2 bg-lime-500 rounded-lg mx-1 flex items-center justify-center"
                >
                    <Text className="text-black text-lg font-bold">{name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}