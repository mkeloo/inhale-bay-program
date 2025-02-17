import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define RootStackParamList if not defined elsewhere
type RootStackParamList = {
    UserAddReward: undefined;
};

export default function UserAddReward() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <View className="flex-1 items-center justify-center bg-slate-900">
            <Text className="text-white text-2xl">Select Your Reward</Text>
            <Button title="Next" onPress={() => navigation.navigate("UserAddReward")} />
        </View>
    );
}