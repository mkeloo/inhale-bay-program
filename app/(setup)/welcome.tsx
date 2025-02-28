import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import BatteryStatus from "@/components/shared/BatteryLevel";
import WifiStrengthChecker from "@/components/shared/CheckWifi";
import { fetchDeviceStatus, subscribeToDeviceStatus } from "@/utils/actions";
import { DeviceStatus } from "@/types/type";
import { Wifi, WifiOff } from "lucide-react-native";

export default function SetupWelcomeScreen() {
    // 🔍 State to Track Device Status
    const [clientStatus, setClientStatus] = useState<DeviceStatus | null>(null);
    const [handlerStatus, setHandlerStatus] = useState<DeviceStatus | null>(null);

    // 🛠️ Fetch Initial Status & Subscribe to Real-Time Updates
    useEffect(() => {
        const loadStatus = async () => {
            const status = await fetchDeviceStatus();
            if (status) {
                setClientStatus(status.find((d) => d.client === true) || null);
                setHandlerStatus(status.find((d) => d.client === false) || null);
            }
        };

        loadStatus(); // Initial load
        const unsubscribe = subscribeToDeviceStatus((updatedStatus) => {
            setClientStatus(updatedStatus.find((d) => d.client === true) || null);
            setHandlerStatus(updatedStatus.find((d) => d.client === false) || null);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-4xl my-4">Welcome Screen!</Text>

            {/* 🔋 Battery Status Display */}
            <BatteryStatus />

            {/* 📶 WiFi Strength Checker */}
            <WifiStrengthChecker />

            <View className="w-full flex flex-row items-center justify-center gap-x-20">
                {/* Navigation Buttons */}
                <View className="flex items-center justify-center gap-y-4 mt-6">
                    <Pressable
                        onPress={() => router.push("/(root)/(admin)/admin")}
                        className="bg-blue-500 p-4 rounded-xl"
                    >
                        <Text className="text-white text-2xl">Admin Route</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/(root)/(client)/(main)/(signup)/clientPhone")}
                        className="bg-yellow-500 p-4 rounded-xl"
                    >
                        <Text className="text-white text-2xl">Client Route</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/(root)/(handler)/handlerConfirm")}
                        className="bg-red-500 p-4 rounded-xl"
                    >
                        <Text className="text-white text-2xl">Handler Route</Text>
                    </Pressable>
                </View>

                {/* 🗂️ Display Device Status (Now Real-time) */}
                <View className="mt-6 flex flex-row items-center justify-center gap-x-10">
                    {/* Client Device */}
                    <View className="flex items-center">
                        <Text className="text-2xl font-bold">Client Device</Text>
                        <View
                            className={`w-20 h-20 mt-2 rounded-full flex items-center justify-center ${clientStatus?.is_online && !clientStatus?.message?.toLowerCase().includes("stopping")
                                ? "bg-green-900"
                                : "bg-red-900"
                                }`}
                        >
                            {clientStatus?.is_online && !clientStatus?.message?.toLowerCase().includes("stopping") ? (
                                <Wifi size={40} color="white" />
                            ) : (
                                <WifiOff size={40} color="white" />
                            )}
                        </View>
                        <Text className="text-lg text-center mt-2">{clientStatus?.message || "Waiting for status..."}</Text>
                    </View>

                    {/* Handler Device */}
                    <View className="flex items-center">
                        <Text className="text-2xl font-bold">Handler Device</Text>
                        <View
                            className={`w-20 h-20 mt-2 rounded-full flex items-center justify-center ${handlerStatus?.is_online && !handlerStatus?.message?.toLowerCase().includes("stopping")
                                ? "bg-green-900"
                                : "bg-red-900"
                                }`}
                        >
                            {handlerStatus?.is_online && !handlerStatus?.message?.toLowerCase().includes("stopping") ? (
                                <Wifi size={40} color="white" />
                            ) : (
                                <WifiOff size={40} color="white" />
                            )}
                        </View>
                        <Text className="text-lg text-center mt-2">{handlerStatus?.message || "Waiting for status..."}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}


// Moksh is a Full Stack Developer specializing in maintaining legacy codebases, building full-stack web and mobile applications, and delivering reliable solutions to meet client needs. Whether refining an existing platform or developing new solutions from the ground up, he is committed to providing high-quality results that align with client goals and expectations.

