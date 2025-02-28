import { SafeAreaView, ScrollView, View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
    fetchDeviceStatus,
    subscribeToDeviceStatus,
    fetchDeviceInfoForAdmin,
} from "@/utils/actions";
import { DeviceStatus } from "@/types/type";
import {
    Wifi,
    WifiOff,
    BatteryCharging,
    BatteryLow,
    BatteryFull,
    Signal,
    Globe,
    Antenna,
} from "lucide-react-native";

export default function AdminScreen() {
    // 🔍 State to Track Device Status & Info
    const [clientStatus, setClientStatus] = useState<DeviceStatus | null>(null);
    const [handlerStatus, setHandlerStatus] = useState<DeviceStatus | null>(null);
    const [clientDeviceInfo, setClientDeviceInfo] = useState<any | null>(null);
    const [handlerDeviceInfo, setHandlerDeviceInfo] = useState<any | null>(null);

    // 🛠️ Fetch Initial Status & Subscribe to Real-Time Updates
    useEffect(() => {
        const loadStatus = async () => {
            const status = await fetchDeviceStatus();
            if (status) {
                setClientStatus(status.find((d) => d.client === true) || null);
                setHandlerStatus(status.find((d) => d.client === false) || null);
            }

            // ✅ Fetch device info for admin
            const { client, handler } = await fetchDeviceInfoForAdmin();
            setClientDeviceInfo(client);
            setHandlerDeviceInfo(handler);
        };

        loadStatus(); // Initial load
        const unsubscribe = subscribeToDeviceStatus((updatedStatus) => {
            setClientStatus(updatedStatus.find((d) => d.client === true) || null);
            setHandlerStatus(updatedStatus.find((d) => d.client === false) || null);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Function to translate dBm to signal strength labels
    const getSignalStrengthLabel = (dBm: number | null) => {
        if (dBm === null) return "N/A";
        if (dBm >= -50) return "Excellent 🚀";
        if (dBm >= -60) return "Good 👍";
        if (dBm >= -70) return "Fair ⚖️";
        if (dBm >= -80) return "Weak ⚠️";
        return "Very Poor ❌";
    };

    // Function to determine battery indicator and color
    const getBatteryIndicator = (batteryLevel: number) => {
        if (batteryLevel > 50)
            return {
                icon: <BatteryFull size={40} color="white" />,
                bgColor: "bg-green-700",
                label: "🔋 Good",
            };
        if (batteryLevel > 20)
            return {
                icon: <BatteryCharging size={40} color="white" />,
                bgColor: "bg-yellow-700",
                label: "⚠️ Moderate",
            };
        return {
            icon: <BatteryLow size={40} color="white" />,
            bgColor: "bg-red-700",
            label: "❌ (Needs Recharge!)",
        };
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerClassName="items-center px-6 pt-20 pb-10"
            // Alternatively, you can use contentContainerStyle for custom styles
            >
                <Text className="text-6xl font-bold text-center mb-6">Admin Screen</Text>

                {/* Navigation Buttons */}
                <View className="flex-row justify-center gap-x-6 mb-10">
                    <Pressable
                        onPress={() => router.push("/welcome")}
                        className="bg-green-400 w-44 py-4 rounded-xl flex items-center justify-center"
                    >
                        <Text className="text-black text-3xl font-bold">Welcome</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/(root)/(client)/(main)/(signup)/clientPhone")}
                        className="bg-yellow-400 w-44 py-4 rounded-xl flex items-center justify-center"
                    >
                        <Text className="text-black text-3xl font-bold">Client</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => router.push("/(root)/(handler)/handlerConfirm")}
                        className="bg-red-400 w-44 py-4 rounded-xl flex items-center justify-center"
                    >
                        <Text className="text-black text-3xl font-bold">Handler</Text>
                    </Pressable>
                </View>

                {/* Split View for Client vs Handler */}
                <View className="w-full flex-row justify-center gap-x-10 flex-wrap">
                    {[
                        { label: "Client Device", status: clientStatus, info: clientDeviceInfo },
                        { label: "Handler Device", status: handlerStatus, info: handlerDeviceInfo },
                    ].map(({ label, status, info }, index) => (
                        <View
                            key={index}
                            className="w-full max-w-lg mb-10 p-6 bg-gray-200 rounded-xl shadow-md"
                        >
                            <Text className="text-4xl font-bold mb-4 text-center">{label}</Text>

                            {/* Device Status */}
                            <View className="w-full p-4 rounded-lg bg-gray-300 text-center">
                                <Text className="text-3xl font-bold">Device Status</Text>
                            </View>
                            <View className="flex-row items-center justify-between gap-x-4 p-4 bg-gray-100 rounded-xl my-4">
                                <View
                                    className={`w-16 h-16 rounded-full flex items-center justify-center 
                                    ${status?.is_online &&
                                            !status?.message?.toLowerCase().includes("stopping")
                                            ? "bg-green-900"
                                            : "bg-red-900"
                                        }`}
                                >
                                    {status?.is_online &&
                                        !status?.message?.toLowerCase().includes("stopping") ? (
                                        <Wifi size={40} color="white" />
                                    ) : (
                                        <WifiOff size={40} color="white" />
                                    )}
                                </View>
                                <Text className="text-2xl">
                                    {status?.message || "Waiting for status..."}
                                </Text>
                            </View>

                            {/* Battery Level Status */}
                            <View className="w-full p-4 rounded-lg bg-gray-300 text-center mt-6">
                                <Text className="text-3xl font-bold">Battery Level Status</Text>
                            </View>
                            <View className="flex-row items-center justify-between gap-x-4 p-4 bg-gray-100 rounded-xl my-4">
                                {info && (
                                    <View
                                        className={`w-16 h-16 rounded-full flex items-center justify-center ${getBatteryIndicator(info.battery_level).bgColor
                                            }`}
                                    >
                                        {getBatteryIndicator(info.battery_level).icon}
                                    </View>
                                )}
                                <Text className="text-2xl">
                                    {info?.battery_level
                                        ? `${info.battery_level}% - ${getBatteryIndicator(info.battery_level).label
                                        }`
                                        : "N/A"}
                                </Text>
                            </View>

                            {/* Network Strength Status */}
                            <View className="w-full p-4 rounded-lg bg-gray-300 text-center mt-6">
                                <Text className="text-3xl font-bold">Network Strength Status</Text>
                            </View>
                            <View className="flex-row items-center justify-between gap-x-4 p-3 bg-gray-100 rounded-lg mt-4">
                                <View className="flex flex-row items-center gap-x-2">
                                    <View className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-900">
                                        <Signal size={40} color="white" />
                                    </View>
                                    <Text className="text-2xl">
                                        WiFi:
                                    </Text>
                                </View>

                                <Text className="text-2xl">
                                    {info?.wifi_strength || "N/A"} (
                                    {getSignalStrengthLabel(parseInt(info?.wifi_strength) || null)})
                                </Text>
                            </View>
                            <View className="flex-row items-center justify-between gap-x-4 p-3 bg-gray-100 rounded-lg mt-4">
                                <View className="flex flex-row items-center gap-x-2">
                                    <View className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-900">
                                        <Globe size={40} color="white" />
                                    </View>
                                    <Text className="text-2xl">
                                        IP:
                                    </Text>
                                </View>
                                <Text className="text-2xl">
                                    {info?.ip_address || "N/A"}
                                </Text>
                            </View>
                            <View className="flex-row items-center justify-between gap-x-4 p-3 bg-gray-100 rounded-lg mt-4">
                                <View className="flex flex-row items-center gap-x-2">
                                    <View className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-900">
                                        <Wifi size={40} color="white" />
                                    </View>
                                    <Text className="text-2xl">
                                        Connection:
                                    </Text>
                                </View>

                                <Text className="text-2xl">
                                    {info?.connection_type || "N/A"}
                                </Text>
                            </View>
                            <View className="flex-row items-center justify-between gap-x-4 p-3 bg-gray-100 rounded-lg mt-4">
                                <View className="flex flex-row items-center gap-x-2">
                                    <View className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-900">
                                        <Antenna size={40} color="white" />
                                    </View>
                                    <Text className="text-2xl">
                                        Connected:
                                    </Text>
                                </View>
                                <Text className="text-2xl">
                                    {info?.is_connected ? "Yes" : "No"}
                                </Text>

                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}