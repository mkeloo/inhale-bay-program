import { View, Text, Image, Pressable, ScrollView, TextInput } from "react-native";
import React, { useState } from "react";
import ModalContentWrapper from "@/components/wrappers/ModalContentWrapper";
import { ModalProps } from "@/types/type";
import { getAvatar } from "@/utils/functions";
import { membershipColors } from "@/lib/data";
import { Check, Edit2 } from "lucide-react-native";

// Temporary user profile object
const userProfile = {
    id: 1,
    name: "John Doe",
    phone_number: "1234567890",
    current_points: 130,
    last_visit: "02/17/2025",
    member_since: "01/01/2020",
    membership_level: "New",
    avatar_name: "Bear",
    lifetime_points: 1000,
};

export default function UserFullProfileScreen({ modalVisible, setModalVisible }: ModalProps) {
    // Get avatar image dynamically
    const avatarImage = getAvatar(userProfile.avatar_name);
    const membershipColor = membershipColors[userProfile.membership_level as keyof typeof membershipColors];

    // Editable state for name & phone
    const [name, setName] = useState(userProfile.name);
    const [phone, setPhone] = useState(userProfile.phone_number);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    return (
        <ModalContentWrapper modalVisible={modalVisible} setModalVisible={setModalVisible}>
            {/* Scrollable Content */}
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 w-full px-6">
                {/* Title */}
                <Text className="text-black text-4xl font-bold text-center mb-6">Full Member Profile</Text>

                {/* Profile Picture */}
                <View className="items-center mb-6">
                    {avatarImage && (
                        <Image source={avatarImage} className="w-36 h-36 rounded-2xl border-4 border-gray-300 shadow-lg" />
                    )}
                </View>

                {/* Essential Info (Name & Phone) - Two Column Layout */}
                <View className="flex-row justify-between w-full gap-x-4 mb-4">
                    {/* Name */}
                    <View className="flex-1 bg-gray-100 rounded-lg shadow-md px-4 py-3 flex-row items-center">
                        {isEditingName ? (
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                className="flex-1 text-blue-600 text-2xl font-bold"
                            />
                        ) : (
                            <Text className="flex-1 text-blue-600 text-2xl font-bold">{name}</Text>
                        )}
                        <Pressable onPress={() => setIsEditingName(!isEditingName)}>
                            {isEditingName ? (
                                <Check size={24} color="green" strokeWidth={3} /> // Show Checkmark when editing
                            ) : (
                                <Edit2 size={24} color="gray" /> // Show Pencil when not editing
                            )}
                        </Pressable>
                    </View>

                    {/* Phone Number */}
                    <View className="flex-1 bg-gray-100 rounded-lg shadow-md px-4 py-3 flex-row items-center">
                        {isEditingPhone ? (
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                className="flex-1 text-blue-600 text-2xl font-bold"
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text className="flex-1 text-blue-600 text-2xl font-bold">{phone}</Text>
                        )}
                        <Pressable onPress={() => setIsEditingPhone(!isEditingPhone)}>
                            {isEditingPhone ? (
                                <Check size={24} color="green" strokeWidth={3} /> // Show Checkmark when editing
                            ) : (
                                <Edit2 size={24} color="gray" /> // Show Pencil when not editing
                            )}
                        </Pressable>
                    </View>
                </View>

                {/* Two-Column Layout for Other Details */}
                <View className="flex-row flex-wrap justify-between gap-4">
                    {/* Column 1 */}
                    <View className="w-[48%] bg-gray-100 rounded-lg shadow-md px-6 py-4">
                        <Text className="text-gray-700 text-xl font-semibold">Current Points</Text>
                        <Text className="text-green-600 text-2xl font-bold">{userProfile.current_points}</Text>
                    </View>

                    <View className="w-[48%] bg-gray-100 rounded-lg shadow-md px-6 py-4">
                        <Text className="text-gray-700 text-xl font-semibold">Lifetime Points</Text>
                        <Text className="text-purple-600 text-2xl font-bold">{userProfile.lifetime_points}</Text>
                    </View>

                    {/* Membership Level - Full Width */}
                    <View className="w-full mt-2 px-6 py-3 rounded-lg" style={{ backgroundColor: membershipColor }}>
                        <Text className="text-white font-bold text-2xl text-center uppercase">{userProfile.membership_level}</Text>
                    </View>

                    {/* Column 2 */}
                    <View className="w-[48%] bg-gray-100 rounded-lg shadow-md px-6 py-4">
                        <Text className="text-gray-700 text-xl font-semibold">Last Visit</Text>
                        <Text className="text-black text-xl font-bold">{userProfile.last_visit}</Text>
                    </View>

                    <View className="w-[48%] bg-gray-100 rounded-lg shadow-md px-6 py-4">
                        <Text className="text-gray-700 text-xl font-semibold">Member Since</Text>
                        <Text className="text-black text-xl font-bold">{userProfile.member_since}</Text>
                    </View>
                </View>

                {/* Close Button */}
                <Pressable
                    onPress={() => setModalVisible(false)}
                    className="mt-6 px-6 py-4 rounded-xl bg-red-600 w-full"
                >
                    <Text className="text-white text-2xl font-bold text-center">Close</Text>
                </Pressable>
            </ScrollView>
        </ModalContentWrapper>
    );
}