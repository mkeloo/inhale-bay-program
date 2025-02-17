import React from "react";
import { View, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import screens
import UserProfile from "../(user)/userProfile";
import UserRewardSelect from "../(user)/userRewardSelect";
import UserAddReward from "../(user)/userAddReward";
import UserRewardSummary from "../(user)/userRewardSummary";

const Stack = createStackNavigator();

export default function RootLayout() {
    return (
        <View className="flex-1 flex-row">
            {/* Left Side: Fixed UserProfile (30%) */}
            <View className="w-[30%] bg-gray-800 p-4">
                <UserProfile />
            </View>

            {/* Right Side: Stack Navigation (70%) */}
            <View className="w-[70%] bg-gray-900 p-4">
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="UserRewardSelect" component={UserRewardSelect} />
                    <Stack.Screen name="UserAddReward" component={UserAddReward} />
                    <Stack.Screen name="UserRewardSummary" component={UserRewardSummary} />
                </Stack.Navigator>
            </View>
        </View>
    );
}