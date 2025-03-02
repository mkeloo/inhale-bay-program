import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Landmark, Cable, Wifi, ScrollText, } from "lucide-react-native"
import NetworkSettings from '@/components/handler/settings/NetworkSettings';
import AboutSettings from '@/components/handler/settings/AboutSettings';
import DeviceSettings from '@/components/handler/settings/DeviceSettings';
import SubmitRequest from '@/components/handler/settings/SubmitRequest';


export default function HandlerSettingsScreen() {
    // Define your tabs
    const tabs = [
        { id: 'about', label: 'Store Information', icon: <Landmark size={35} strokeWidth={2} color="#1F2937" /> }, // Gray-800
        { id: 'device', label: 'Connected Device', icon: <Cable size={35} strokeWidth={2} color="#1F2937" /> }, // Gray-800
        { id: 'network', label: 'Network Information', icon: <Wifi size={35} strokeWidth={2} color="#1F2937" /> }, // Gray-800
        { id: 'request', label: 'Submit Request', icon: <ScrollText size={35} strokeWidth={2} color="#1F2937" /> }, // Gray-800
    ];

    // State to track active tab
    const [activeTab, setActiveTab] = useState('about');

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'about':
                return <AboutSettings />;
            case 'device':
                return <DeviceSettings />;
            case 'network':
                return <NetworkSettings />;
            case 'request':
                return <SubmitRequest />;
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 flex-row bg-white px-6 pb-6 pt-8 mb-20">
            {/* Sidebar: 30% width */}
            <View className="w-[35%] bg-gray-200 px-5 py-5 rounded-xl shadow-md flex items-center justify-between">

                {/* Sidebar Tabs */}
                <View className="w-full">
                    {/* Title */}
                    <Text className="text-4xl font-bold text-gray-800 mt-4 mb-4 text-center tracking-widest">Settings</Text>
                    {tabs.map((tab, index) => (
                        <Pressable
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            className={`flex-row items-center gap-x-5 py-8 px-6 rounded-xl text-left active:scale-95 transition-transform duration-150
                                ${activeTab === tab.id ? "bg-gray-300" : "bg-transparent"}
                                ${index !== tabs.length - 1 ? "border-b border-gray-400" : ""}`}
                        >
                            {tab.icon}
                            <Text className="text-[24px] font-bold text-gray-800">{tab.label}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* Company Name */}
                <Text className="text-lg text-gray-600 -mb-2 uppercase w-full text-center font-bold tracking-widest">
                    Inhale Bay Smoke Shop
                </Text>
            </View>

            {/* Content area: 70% width */}
            <View className="w-[65%] pl-8">{renderContent()}</View>
        </View>
    );
}