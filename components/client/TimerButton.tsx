import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

interface TimerButtonProps {
    duration?: number; // seconds until auto-navigation
    route: string;     // destination route
    title: string;     // button title
}

export default function TimerButton({
    duration = 5,
    route,
    title,
}: TimerButtonProps) {
    const [timer, setTimer] = useState(duration);
    const progress = useState(new Animated.Value(1))[0];
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Start the shrinking background animation
        Animated.timing(progress, {
            toValue: 0,
            duration: duration * 1000,
            useNativeDriver: false,
        }).start();

        // Start the countdown timer
        countdownRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    // Trigger success haptics before navigating automatically
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.push(route as any);
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    return (
        <View className="w-full items-center justify-center">
            <TouchableOpacity
                onPress={() => {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    // Trigger haptic feedback on manual press
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.push(route as any);
                }}
                className="relative w-64 rounded-xl overflow-hidden bg-purple-300"
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}
            >
                {/* Animated Background Shrink */}
                <Animated.View
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"],
                        }),
                        backgroundColor: "#166534",
                    }}
                />

                {/* Button Content */}
                <View className="p-5 flex flex-row items-center justify-center gap-x-3">
                    <Text className="text-white font-bold text-2xl uppercase text-center z-10">
                        {title}
                    </Text>
                    <Text className="text-white text-xl font-bold opacity-70 z-10">
                        ({timer}s)
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}