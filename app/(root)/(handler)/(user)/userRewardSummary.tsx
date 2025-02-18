import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function UserRewardSummary() {
    const [redeemedReward, setRedeemedReward] = useState(true); // Toggle to show/hide redeemed reward
    const earnedPoints = 25; // Example earned points
    const deductedPoints = redeemedReward ? -200 : 0; // Deducted if a reward was redeemed
    const totalPoints = 350; // Example total after calculations

    // Timer state
    const [timer, setTimer] = useState(10);

    // Effect to start countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval); // Cleanup interval on unmount
        } else {
            router.push('/(root)/(handler)/(main)/handlerHome'); // Auto navigate when timer hits 0
        }
    }, [timer]);

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            {/* Title */}
            <Text className="text-black text-4xl font-bold mb-6">Visit Summary</Text>

            {/* Summary Details */}
            <View className="w-full h-[340px] max-w-lg flex items-center justify-between bg-white rounded-lg shadow-lg px-6 py-6">
                <View className="w-full py-2 gap-y-6 flex items-center justify-center">
                    {/* Redeemed a reward (Only if applicable) */}
                    {redeemedReward && (
                        <View className="w-full flex-row justify-between mb-4">
                            <Text className="text-gray-600 font-bold text-2xl">Redeemed a reward</Text>
                            <Text className="text-red-600 text-3xl font-bold">{deductedPoints} pts</Text>
                        </View>
                    )}

                    {/* Earned Points */}
                    <View className="w-full flex-row justify-between mb-4">
                        <Text className="text-gray-600 font-bold text-2xl">Earned points</Text>
                        <Text className="text-green-600 text-3xl font-bold">+{earnedPoints} pts</Text>
                    </View>
                </View>

                {/* Today & New Total - Same View Group */}
                <View className="w-full bg-gray-100 rounded-lg px-4 py-4 mt-6">
                    {/* Today */}
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-black font-bold text-2xl">Today</Text>
                        <Text className="text-black font-bold text-3xl">+{earnedPoints} pts</Text>
                    </View>

                    {/* New Total */}
                    <View className="flex-row justify-between items-center border-t border-gray-300 pt-4">
                        <Text className="text-black font-bold text-3xl">New Total</Text>
                        <View className="flex flex-row items-center justify-center gap-x-1">
                            <Image
                                source={require("../../../../assets/images/screen/reward/coin.png")}
                                className="w-14 h-14"
                            />
                            <Text className="text-4xl font-bold text-amber-600">{totalPoints}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Done Button with Timer */}
            <TouchableOpacity
                onPress={() => router.push('/(root)/(handler)/(main)/handlerHome')}
                className="mt-6 w-full max-w-lg bg-green-600 py-4 rounded-lg shadow-lg flex flex-row items-center justify-center gap-x-2"
            >
                <Text className="text-white font-bold text-2xl uppercase text-center">Done</Text>
                <Text className="text-white text-xl font-bold opacity-70">({timer}s)</Text>
            </TouchableOpacity>
        </View>
    );
}