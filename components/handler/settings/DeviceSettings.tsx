import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { fetchDeviceStatus, fetchDeviceInfoForAdmin } from "@/utils/actions";
import { DeviceStatus } from "@/types/type";
import { BatteryFull, BatteryCharging, BatteryLow, Router, ServerOff } from "lucide-react-native";

// Helper: Determine battery indicator, background color, and label.
const getBatteryIndicator = (batteryLevel: number) => {
    if (batteryLevel > 50)
        return { icon: <BatteryFull size={35} color="white" />, bgColor: "bg-green-700", label: "🔋 Good" };
    if (batteryLevel > 20)
        return { icon: <BatteryCharging size={35} color="white" />, bgColor: "bg-yellow-700", label: "⚠️ Moderate" };
    return { icon: <BatteryLow size={35} color="white" />, bgColor: "bg-red-700", label: "❌ (Needs Recharge!)" };
};

export default function DeviceSettings() {
    const [clientStatus, setClientStatus] = useState<DeviceStatus | null>(null);
    const [handlerStatus, setHandlerStatus] = useState<DeviceStatus | null>(null);
    const [clientDeviceInfo, setClientDeviceInfo] = useState<any | null>(null);
    const [handlerDeviceInfo, setHandlerDeviceInfo] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<"client" | "handler">("client");

    useEffect(() => {
        const fetchInfo = async () => {
            const status = await fetchDeviceStatus();
            if (status) {
                setClientStatus(status.find((d) => d.client === true) || null);
                setHandlerStatus(status.find((d) => d.client === false) || null);
            }

            const { client, handler } = await fetchDeviceInfoForAdmin();
            setClientDeviceInfo(client);
            setHandlerDeviceInfo(handler);
        };
        fetchInfo();
    }, []);

    // Renders both **Device Status** and **Battery Level**
    const renderDeviceInfo = (status: DeviceStatus | null, info: any, title: string) => (
        <View className="w-full p-5 bg-gray-100 rounded-xl border-[3px] border-gray-300">
            <Text className="text-3xl font-bold text-center mt-1 mb-4">{title}</Text>

            {/* Device Status */}
            <View className="w-full p-4 rounded-lg bg-gray-300 text-center">
                <Text className="text-2xl font-bold">Device Status</Text>
            </View>
            <View className="flex-row items-center justify-between gap-x-4 p-4 bg-gray-100 rounded-xl mt-2">
                <View className={`w-16 h-16 rounded-full flex items-center justify-center ${status?.is_online ? "bg-green-900" : "bg-red-700"}`}>
                    {status?.is_online ? <Router size={35} color="white" /> : <ServerOff size={35} color="white" />}
                </View>
                <Text className="text-2xl">{status?.message || "Waiting for status..."}</Text>
            </View>

            {/* Battery Level Status */}
            <View className="w-full p-4 rounded-lg bg-gray-300 text-center mt-6">
                <Text className="text-2xl font-bold">Battery Level Status</Text>
            </View>
            <View className="flex-row items-center justify-between gap-x-4 p-4 bg-gray-100 rounded-xl mt-2">
                {info && (
                    <View className={`w-16 h-16 rounded-full flex items-center justify-center ${getBatteryIndicator(info.battery_level).bgColor}`}>
                        {getBatteryIndicator(info.battery_level).icon}
                    </View>
                )}
                <Text className="text-2xl">
                    {info?.battery_level ? `${info.battery_level}% - ${getBatteryIndicator(info.battery_level).label}` : "N/A"}
                </Text>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white shadow-xl rounded-xl">
            <View className="w-full flex-1 border-[3px] border-gray-300 rounded-xl py-8 px-8 shadow-lg">
                <Text className="text-[40px] font-bold text-center mb-4">Device Status</Text>

                {/* Top Tabs */}
                <View className="flex-row w-full justify-center gap-x-4 px-4 mb-8 mt-4">
                    <Pressable
                        onPress={() => setActiveTab("client")}
                        className={`px-6 py-3 rounded-xl w-1/2 text-center active:scale-95 transition-transform duration-150 border-[3px]  ${activeTab === "client" ? "bg-gray-300 border-neutral-500" : "bg-gray-200 border-neutral-200"
                            }`}
                    >
                        <Text
                            className={`text-xl font-bold text-center ${activeTab === "client" ? "text-gray-900" : "text-gray-600"
                                }`}
                        >
                            Client Device
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab("handler")}
                        className={`px-6 py-3 rounded-xl w-1/2 text-center active:scale-95 transition-transform duration-150 border-[3px]  ${activeTab === "handler" ? "bg-gray-300 border-neutral-500" : "bg-gray-200 border-neutral-200"
                            }`}
                    >
                        <Text
                            className={`text-xl font-bold text-center ${activeTab === "handler" ? "text-gray-900" : "text-gray-600"
                                }`}
                        >
                            Handler Device
                        </Text>
                    </Pressable>
                </View>

                {/* Content Area - Render Device Status & Battery */}
                <View className="w-full flex-1 flex items-center justify-center">
                    {activeTab === "client"
                        ? renderDeviceInfo(clientStatus, clientDeviceInfo, "Client Device Status")
                        : renderDeviceInfo(handlerStatus, handlerDeviceInfo, "Handler Device Status")}
                </View>
            </View>
        </View>
    );
}