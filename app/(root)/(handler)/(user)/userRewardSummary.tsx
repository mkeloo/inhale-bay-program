import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useCustomerStore } from "@/stores/customerStore";
import { useRewardStore } from "@/stores/rewardStore";
import { updateCustomerPoints } from "@/utils/actions";

export default function UserRewardSummary() {
    // Read current customer data
    const { current_points, phone_number, setCustomerData } = useCustomerStore();
    // Read reward info from your reward store
    const { selectedReward, earnedPoints, resetRewardData } = useRewardStore();

    // If no reward is selected, show fallback
    if (!selectedReward) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Text className="text-black text-2xl">No reward selected.</Text>
            </View>
        );
    }

    // Points calculations
    const deductedPoints =
        selectedReward.unlock_points != null ? -selectedReward.unlock_points : 0;
    const currentPoints = current_points || 0;
    const totalPoints = currentPoints + earnedPoints + deductedPoints;

    // Timer
    const [timer, setTimer] = useState(10);
    // We no longer track didUpdate because we won't attempt to re-update on error
    // We'll do a simple "fire & forget" approach.

    // Interval ref
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // "Fire & Forget" update function
    const doBackgroundUpdate = () => {
        console.log("Background update: Earned:", earnedPoints, "Deducted:", deductedPoints);
        updateCustomerPoints(phone_number, totalPoints, earnedPoints)
            .then((res) => {
                if (!res) {
                    console.log("No result from updateCustomerPoints (null). Possibly an error.");
                    // We won't keep re-trying. The user has already navigated away.
                } else {
                    // Sync new total to store
                    setCustomerData({ current_points: totalPoints });
                    resetRewardData();
                    console.log("Points updated successfully (async).");
                }
            })
            .catch((err) => {
                console.error("Error updating points in background:", err);
            });
    };

    const navigateAwayNow = () => {
        // Immediately navigate away
        router.push("/(root)/(handler)/(main)/handlerHome");
    };

    const handleDone = () => {
        // Clear the interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        // Kick off the background update
        doBackgroundUpdate();
        // Immediately navigate
        navigateAwayNow();
    };

    // Timer effect
    useEffect(() => {
        if (timer > 0) {
            intervalRef.current = setInterval(() => setTimer((p) => p - 1), 1000);
        } else {
            // Timer done => do background update and navigate
            handleDone();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [timer]);

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            {/* Title */}
            <Text className="text-black text-4xl font-bold mb-6">Visit Summary</Text>

            {/* Summary Details */}
            <View className="w-full h-[340px] max-w-lg flex items-center justify-between bg-white rounded-lg shadow-lg px-6 py-6">
                <View className="w-full py-2 gap-y-6 flex items-center justify-center">
                    {/* If we subtracted points for a reward */}
                    {deductedPoints !== 0 && (
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

                {/* Today & New Total */}
                <View className="w-full bg-gray-100 rounded-lg px-4 py-4 mt-6">
                    <View className="flex-row justify-between mb-4">
                        <Text className="text-black font-bold text-2xl">Today</Text>
                        <Text
                            className={`text-3xl font-bold ${earnedPoints + deductedPoints >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {earnedPoints + deductedPoints > 0 ? "+" : ""}
                            {earnedPoints + deductedPoints} pts
                        </Text>
                    </View>
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
                onPress={handleDone}
                className="mt-6 w-full max-w-lg bg-green-600 py-4 rounded-lg shadow-lg flex flex-row items-center justify-center gap-x-2"
            >
                <Text className="text-white font-bold text-2xl uppercase text-center">Done</Text>
                <Text className="text-white text-xl font-bold opacity-70">({timer}s)</Text>
            </TouchableOpacity>
        </View>
    );
}