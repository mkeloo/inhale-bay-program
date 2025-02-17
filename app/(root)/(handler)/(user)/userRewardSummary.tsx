import React from "react";
import { View, Text, Button } from "react-native";

import { router } from "expo-router";

export default function UserRewardSummary() {

    return (
        <View className="flex-1 items-center justify-center bg-slate-900">
            <Text className="text-white text-2xl">Reward Summary</Text>
            <Button title="Done" onPress={() => router.push('/(root)/(handler)/(main)/handlerHome')} />
        </View>
    );
}