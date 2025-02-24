// UserFullProfileScreen.tsx
import { View, Text, Image, Pressable, ScrollView, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import ModalContentWrapper from "@/components/wrappers/ModalContentWrapper";
import { ModalProps } from "@/types/type";
import { getAvatar } from "@/utils/functions";
import { membershipColors } from "@/lib/data";
import { Check, Edit2 } from "lucide-react-native";

// Extend ModalProps to include "customer" data with total_visits added
interface UserFullProfileProps extends ModalProps {
    customer: {
        name: string;
        phone_number: string;
        current_points: number;
        last_visit: string;
        member_since: string;
        membership_level: string;
        avatar_name: string;
        lifetime_points: number;
        daysAgo: number;
        total_visits: number;
    };
}

export default function UserFullProfileScreen({
    modalVisible,
    setModalVisible,
    customer,
}: UserFullProfileProps) {
    // Parse dates to show only the date portion
    const parsedLastVisit = new Date(customer.last_visit);
    const lastVisitDate = parsedLastVisit.toLocaleDateString();
    const parsedMemberSince = new Date(customer.member_since);
    const memberSinceDate = parsedMemberSince.toLocaleDateString();

    const avatarImage = getAvatar(customer.avatar_name);
    const membershipColor =
        membershipColors[customer.membership_level as keyof typeof membershipColors];

    // Editable state for name & phone
    const [name, setName] = useState(customer.name);
    const [phone, setPhone] = useState(customer.phone_number);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    useEffect(() => {
        setName(customer.name);
        setPhone(customer.phone_number);
    }, [customer]);

    return (
        <ModalContentWrapper modalVisible={modalVisible} setModalVisible={setModalVisible}>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 w-full px-6">
                <Text className="text-black text-4xl font-bold text-center mb-6">
                    Full Member Profile
                </Text>

                {/* Profile Picture */}
                <View className="items-center mb-6">
                    {avatarImage && (
                        <Image
                            source={avatarImage}
                            className="w-36 h-36 rounded-2xl border-4 border-gray-300 shadow-lg"
                        />
                    )}
                </View>

                {/* Essential Info (Name & Phone) */}
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
                                <Check size={24} color="green" strokeWidth={3} />
                            ) : (
                                <Edit2 size={24} color="gray" />
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
                                <Check size={24} color="green" strokeWidth={3} />
                            ) : (
                                <Edit2 size={24} color="gray" />
                            )}
                        </Pressable>
                    </View>
                </View>

                {/* Other Details */}
                <View className="flex-row flex-wrap justify-between gap-4">
                    {/* Current Points */}
                    <View className="w-[48%] bg-gray-100 rounded-lg shadow-md px-4 py-4">
                        <Text className="text-gray-700 text-xl font-semibold">Current Points</Text>
                        <Text className="text-green-600 text-2xl font-bold">
                            {customer.current_points}
                        </Text>
                    </View>

                    {/* Lifetime Points */}
                    <View className="w-[48%] bg-gray-100 rounded-lg shadow-md px-4 py-4">
                        <Text className="text-gray-700 text-xl font-semibold">Lifetime Points</Text>
                        <Text className="text-purple-600 text-2xl font-bold">
                            {customer.lifetime_points}
                        </Text>
                    </View>
                </View>

                {/* Membership Level (Full Width) */}
                <View
                    className="w-full my-4 px-4 py-3 rounded-lg shadow-md"
                    style={{ backgroundColor: membershipColor }}
                >
                    <Text className="text-white font-bold text-2xl text-center uppercase">
                        {customer.membership_level}
                    </Text>
                </View>

                {/* Row with Last Visit and Member Since */}
                <View className="flex-row justify-between gap-4">
                    {/* Last Visit */}
                    <View className="w-[48%] bg-gray-100 rounded-lg shadow-md px-4 py-4">
                        <Text className="text-gray-700 text-xl font-semibold">Last Visit</Text>
                        <Text className="text-black text-xl font-bold">
                            {lastVisitDate} ({customer.daysAgo} days ago)
                        </Text>
                    </View>

                    {/* Member Since */}
                    <View className="w-[48%] bg-gray-100 rounded-lg shadow-md px-4 py-4">
                        <Text className="text-gray-700 text-xl font-semibold">Member Since</Text>
                        <Text className="text-black text-xl font-bold">{memberSinceDate}</Text>
                    </View>
                </View>

                {/* Total Visits (Full Width) */}
                <View className="w-full mt-4 bg-gray-100 rounded-lg shadow-md px-4 py-4">
                    <Text className="text-gray-700 text-xl font-semibold">Total Visits</Text>
                    <Text className="text-black text-xl font-bold">
                        {customer.total_visits}
                    </Text>
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