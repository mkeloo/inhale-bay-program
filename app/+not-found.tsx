import { View, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { usePathname, useGlobalSearchParams } from "expo-router";

export default function NotFoundScreen() {
    const router = useRouter();

    const currentPath = usePathname();

    const searchParams = useGlobalSearchParams();

    const fullUrl = `${currentPath}?${new URLSearchParams(
        searchParams as never
    ).toString()}`;

    return (
        <View className="flex flex-1 items-center justify-center">
            <Text className="text-2xl font-semibold text-center leading-10">
                This screen doesn't exist.
            </Text>
            <Pressable
                onPress={() => router.push("/")}
                className="px-6 py-4 my-4 bg-yellow-500 rounded-3xl"
            >
                <Text className="text-xl font-semibold text-center text-black">
                    Go Back to Home!
                </Text>
            </Pressable>
            <View className="flex items-start justify-center mt-10 gap-y-2 px-10">
                <Text className="text-lg font-semibold text-black">Current URL: </Text>
                <Text className="text-base font-semibold text-black">{fullUrl}</Text>
            </View>
        </View>
    );
}