import { View, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getAvatar } from "@/utils/functions";
import { membershipColors } from "@/lib/data";
import { MoveLeft, Info } from "lucide-react-native";
import UserFullProfileScreen from "./userFullProfile";

export default function UserProfileScreen() {
    const [modalVisible, setModalVisible] = useState(false);

    // Extract parameters from URL
    const { name, current_points, last_visit, membership_level, avatar_name } = useLocalSearchParams();

    // Get avatar image dynamically
    const avatarImage = getAvatar(avatar_name as string);
    const membershipColor = membershipColors[membership_level as keyof typeof membershipColors];

    return (
        <View className="flex-1 items-center justify-center bg-white px-6 py-4">
            {/* Back Button */}
            <Pressable onPress={() => router.back()} className="absolute top-6 left-6 bg-blue-600 rounded-xl px-3 py-2">
                <MoveLeft color="white" size={30} />
            </Pressable>

            <View
                className='w-full flex items-center justify-between pt-6 rounded-3xl border-4 mt-10'
                style={{ borderColor: membershipColor }}
            >
                {/* Avatar & Name */}
                <View className="flex items-center justify-center">
                    {/* Avatar Image */}
                    {avatarImage && (
                        <Image
                            source={avatarImage}
                            className="w-36 h-36 py-2 rounded-2xl border-4 border-gray-300 shadow-lg"
                        />
                    )}

                    {/* Name */}
                    <Text className="text-blue-600 text-3xl font-bold mt-4">{name}</Text>

                    {/* Current Points */}
                    <View className="flex flex-row items-center justify-center gap-x-1 mt-2">
                        <Image
                            source={require("../../../../assets/images/screen/reward/coin.png")}
                            className="w-10 h-10"
                        />
                        <Text className="text-3xl font-bold text-amber-600">
                            {current_points}
                        </Text>
                    </View>
                </View>

                {/* Last Visit & Membership */}
                <View className="w-full mt-4">
                    <View className="flex items-center justify-center gap-y-1 border-t-2 border-gray-300 py-4">
                        <Text className="text-gray-500 text-lg font-semibold">Last Visit</Text>
                        <Text className="text-black text-2xl font-bold">{last_visit}</Text>
                    </View>

                    {/* Membership Level */}
                    <View
                        className="mt-2 px-6 py-3 rounded-xl rounded-t-none w-full"
                        style={{ backgroundColor: membershipColor }}
                    >
                        <Text className="text-white font-bold text-2xl text-center uppercase">{membership_level}</Text>
                    </View>


                </View>
            </View>

            {/* Full User Profile */}
            <Pressable
                onPress={() => {
                    setModalVisible(true);
                }}
                className="mt-4 px-6 py-4 rounded-xl bg-blue-600 flex flex-row items-center justify-center gap-x-2"
            >
                <Info color="white" size={30} strokeWidth={3} />
                <Text className="text-white text-2xl font-bold">Full Profile</Text>
            </Pressable>


            <UserFullProfileScreen modalVisible={modalVisible} setModalVisible={setModalVisible} />

        </View >
    );
}