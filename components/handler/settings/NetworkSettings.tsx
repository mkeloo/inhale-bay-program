import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import {
    fetchDeviceInfoForAdmin,
} from "@/utils/actions";
import {
    Signal,
    Globe,
    Wifi,
    Antenna,
    WifiOff,
} from "lucide-react-native";

// Helper function to translate dBm to a label
const getSignalStrengthLabel = (dBm: number | null): string => {
    if (dBm === null) return "N/A";
    if (dBm >= -50) return "Excellent 🚀";
    if (dBm >= -60) return "Good 👍";
    if (dBm >= -70) return "Fair ⚖️";
    if (dBm >= -80) return "Weak ⚠️";
    return "Very Poor ❌";
};

export default function NetworkSettings() {
    // We'll store both client and handler device info here
    const [clientDeviceInfo, setClientDeviceInfo] = useState<any | null>(null);
    const [handlerDeviceInfo, setHandlerDeviceInfo] = useState<any | null>(null);
    // Active tab: "client" or "handler"
    const [activeTab, setActiveTab] = useState<"client" | "handler">("client");

    useEffect(() => {
        const fetchInfo = async () => {
            const { client, handler } = await fetchDeviceInfoForAdmin();
            setClientDeviceInfo(client);
            setHandlerDeviceInfo(handler);
        };
        fetchInfo();
    }, []);


    // Render the network info blocks with a title (for Client or Handler)
    const renderNetworkInfo = (info: any, title: string) => {
        return (
            <View className="w-full p-5 bg-gray-100 rounded-xl border-[3px] border-gray-300">
                <Text className="text-3xl font-bold text-center mt-1 mb-4">{title}</Text>

                <View className="flex-row items-center justify-between gap-x-4 p-3 ">
                    <View className="flex-row items-center gap-x-2">
                        <View className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-900">
                            <Signal size={40} color="white" />
                        </View>
                        <Text className="text-2xl">WiFi:</Text>
                    </View>
                    <Text className="text-2xl">
                        {info?.wifi_strength || "N/A"} (
                        {getSignalStrengthLabel(parseInt(info?.wifi_strength) || null)})
                    </Text>
                </View>

                {/* IP Address */}
                <View className="flex-row items-center justify-between gap-x-4 p-3 bg-gray-100 rounded-lg">
                    <View className="flex-row items-center gap-x-2">
                        <View className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-900">
                            <Globe size={40} color="white" />
                        </View>
                        <Text className="text-2xl">IP:</Text>
                    </View>
                    <Text className="text-2xl">{info?.ip_address || "N/A"}</Text>
                </View>

                {/* Connection Type */}
                <View className="flex-row items-center justify-between gap-x-4 p-3 bg-gray-100 rounded-lg">
                    <View className="flex-row items-center gap-x-2">
                        <View className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-900">
                            <Wifi size={40} color="white" />
                        </View>
                        <Text className="text-2xl">Connection:</Text>
                    </View>
                    <Text className="text-2xl">{info?.connection_type || "N/A"}</Text>
                </View>

                {/* Connected Status */}
                <View className="flex-row items-center justify-between gap-x-4 p-3 bg-gray-100 rounded-lg">
                    <View className="flex-row items-center gap-x-2">
                        <View className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-900">
                            <Antenna size={40} color="white" />
                        </View>
                        <Text className="text-2xl">Connected:</Text>
                    </View>
                    <Text className="text-2xl">{info?.is_connected ? "Yes" : "No"}</Text>
                </View>
            </View>
        );
    };
    return (
        <View className="flex-1 bg-white shadow-xl rounded-xl">
            <View className="w-full flex-1 border-[3px] border-gray-300 rounded-xl py-8 px-8 shadow-lg">
                <Text className="text-[40px] font-bold text-center mb-4">Network Status</Text>

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

                {/* Content Area */}
                <View className="w-full flex-1 flex items-center justify-center">
                    {activeTab === "client"
                        ? renderNetworkInfo(clientDeviceInfo, "Client Network Status")
                        : renderNetworkInfo(handlerDeviceInfo, "Handler Network Status")}
                </View>
            </View>
        </View>
    );
}