import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Home, History, Settings } from "lucide-react-native"; // Lucide icons

// Custom tab icon component
const TabIcon = ({ focused, Icon }: { focused: boolean; Icon: any }) => (
    <View className="flex items-center justify-center">
        <Icon size={28} color={focused ? "#4ADE80" : "#D4D8EC"} />
    </View>
);

export default function HandlerTabsLayout() {
    return (
        <View className="flex-1">
            {/* Tabs Navigator */}
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "#4ADE80",
                    tabBarInactiveTintColor: "#D4D8EC",
                    tabBarStyle: {
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#2B3252",
                        height: 70,
                        paddingBottom: 4,
                    },
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: "700",
                    },
                }}
            >
                <Tabs.Screen
                    name="handlerHistory"
                    options={{
                        tabBarIcon: ({ focused }) => <TabIcon Icon={History} focused={focused} />,
                        tabBarLabel: "History",
                    }}
                />

                <Tabs.Screen
                    name="handlerHome"
                    options={{
                        tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
                        tabBarLabel: "Home",
                    }}
                />

                <Tabs.Screen
                    name="handlerSettings"
                    options={{
                        tabBarIcon: ({ focused }) => <TabIcon Icon={Settings} focused={focused} />,
                        tabBarLabel: "Settings",
                    }}
                />
            </Tabs>
        </View>
    );
}