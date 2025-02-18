import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

// Import screens
import UserProfile from "../(user)/userProfile";
import UserRewardSelect from "../(user)/userRewardSelect";
import UserAddReward from "../(user)/userAddReward";
import UserRewardSummary from "../(user)/userRewardSummary";

const Stack = createStackNavigator();

export default function RootLayout() {
    return (
        <View className="flex-1 flex-row bg-white gap-x-2 px-4 py-3">
            {/* Left Side: Fixed UserProfile (30%) */}
            <View className="w-[30%] bg-gray-300 rounded-2xl p-4">
                <UserProfile />
            </View>

            {/* Right Side: Stack Navigation (70%) */}
            <View className="w-[70%] bg-gray-300 rounded-2xl p-4">
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="UserRewardSelect" component={UserRewardSelect} />
                    <Stack.Screen name="UserAddReward" component={UserAddReward} />
                    <Stack.Screen name="UserRewardSummary" component={UserRewardSummary} />
                </Stack.Navigator>
            </View>
        </View>
    );
}