import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { router } from "expo-router";

export default function TimerButton({ duration = 5 }) {
    const [timer, setTimer] = useState(duration); // Countdown starts from given duration
    const progress = useState(new Animated.Value(1))[0]; // Full width initially

    useEffect(() => {
        // Shrinking Background Animation
        Animated.timing(progress, {
            toValue: 0, // Shrinks to 0 width
            duration: duration * 1000,
            useNativeDriver: false,
        }).start();

        // Countdown Timer
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    clearInterval(countdown);
                    router.push("/welcome"); // Navigate when timer reaches 0
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown); // Cleanup timer on unmount
    }, []);

    return (
        <View className="w-full items-center justify-center">
            <TouchableOpacity
                onPress={() => router.push("/welcome")}
                className="relative w-64 rounded-xl overflow-hidden bg-purple-300"
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                {/* Animated Background Shrink INSIDE the Button */}
                <Animated.View
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"], // Background shrinks
                        }),
                        backgroundColor: "#166534", // Dark Green Background
                    }}
                />

                {/* Done button with Countdown Timer Display */}
                <View className="p-5 flex flex-row items-center justify-center gap-x-3">
                    <Text className="text-white font-bold text-2xl uppercase text-center z-10">
                        Done
                    </Text>
                    <Text className="text-white text-xl font-bold opacity-70 z-10">
                        ({timer}s)
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}