// UserProfileScreen.tsx
import { View, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getAvatar } from "@/utils/functions";
import { membershipColors } from "@/lib/data";
import { MoveLeft, Info } from "lucide-react-native";
import UserFullProfileScreen from "./userFullProfile";

export default function UserProfileScreen() {
    const [modalVisible, setModalVisible] = useState(false);

    // Extract parameters from URL (including total_visits)
    const {
        name,
        current_points,
        last_visit,
        membership_level,
        avatar_name,
        phone_number,
        lifetime_points,
        member_since,
        total_visits,
    } = useLocalSearchParams();

    // Parse last_visit for "days ago"
    const parsedLastVisit = new Date(last_visit as string);
    const daysAgo = Math.floor(
        (Date.now() - parsedLastVisit.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Get avatar image dynamically
    const avatarImage = getAvatar(avatar_name as string);
    const membershipColor =
        membershipColors[membership_level as keyof typeof membershipColors];

    // Build a customer object to pass around (including total_visits)
    const customer = {
        name: Array.isArray(name) ? name[0] : name || "N/A",
        phone_number: Array.isArray(phone_number) ? phone_number[0] : phone_number || "N/A",
        current_points: Number(current_points || 0),
        last_visit: Array.isArray(last_visit) ? last_visit[0] : last_visit || "",
        lifetime_points: Number(lifetime_points || 0),
        membership_level: Array.isArray(membership_level)
            ? membership_level[0]
            : membership_level || "new",
        avatar_name: Array.isArray(avatar_name) ? avatar_name[0] : avatar_name || "",
        member_since: Array.isArray(member_since)
            ? member_since[0]
            : member_since || "",
        total_visits: Number(Array.isArray(total_visits) ? total_visits[0] : total_visits || 0),
        daysAgo,
    };

    return (
        <View className="flex-1 items-center justify-center bg-white px-6 py-4">
            {/* Back Button */}
            <Pressable
                onPress={() => router.back()}
                className="absolute top-6 left-6 bg-blue-600 rounded-xl px-3 py-2"
            >
                <MoveLeft color="white" size={30} />
            </Pressable>

            <View
                className="w-full flex items-center justify-between pt-6 rounded-3xl border-4 mt-10"
                style={{ borderColor: membershipColor }}
            >
                {/* Avatar & Name */}
                <View className="flex items-center justify-center">
                    {avatarImage && (
                        <Image
                            source={avatarImage}
                            className="w-36 h-36 py-2 rounded-2xl border-4 border-gray-300 shadow-lg"
                        />
                    )}

                    <Text className="text-blue-600 text-3xl font-bold mt-4">
                        {customer.name}
                    </Text>

                    {/* Current Points */}
                    <View className="flex flex-row items-center justify-center gap-x-1 mt-2">
                        <Image
                            source={require("../../../../assets/images/screen/reward/coin.png")}
                            className="w-10 h-10"
                        />
                        <Text className="text-3xl font-bold text-amber-600">
                            {customer.current_points}
                        </Text>
                    </View>
                </View>

                {/* Last Visit & Membership */}
                <View className="w-full mt-4">
                    <View className="flex items-center justify-center gap-y-1 border-t-2 border-gray-300 py-4">
                        <Text className="text-gray-500 text-lg font-semibold">Last Visit</Text>
                        <Text className="text-black text-3xl font-bold">
                            {parsedLastVisit.toLocaleDateString()}
                        </Text>
                        <Text className="text-gray-500 text-2xl font-semibold">
                            ({customer.daysAgo} days ago)
                        </Text>
                    </View>

                    {/* Membership Level */}
                    <View
                        className="mt-2 px-6 py-3 rounded-xl rounded-t-none w-full"
                        style={{ backgroundColor: membershipColor }}
                    >
                        <Text className="text-white font-bold text-2xl text-center uppercase">
                            {customer.membership_level}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Full User Profile Button */}
            <Pressable
                onPress={() => setModalVisible(true)}
                className="mt-4 px-6 py-4 rounded-xl bg-blue-600 flex flex-row items-center justify-center gap-x-2"
            >
                <Info color="white" size={30} strokeWidth={3} />
                <Text className="text-white text-2xl font-bold">Full Profile</Text>
            </Pressable>

            {/* Pass the customer object to UserFullProfileScreen */}
            <UserFullProfileScreen
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                customer={customer}
            />
        </View>
    );
}