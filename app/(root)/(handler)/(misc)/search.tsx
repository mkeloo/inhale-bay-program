import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    Pressable
} from "react-native";
import { BadgeCheck, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { fetchCustomerByPhone, fetchCustomerById } from "@/utils/actions";
import { getAvatar } from "@/utils/functions";
import { Customer } from "@/types/type";
import { useCustomerStore } from "@/stores/customerStore";
import BackButton from "@/components/shared/BackButton";

export default function SearchScreen() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [customerResult, setCustomerResult] = useState<Customer | "notfound" | null>(null);
    const deleteInterval = useRef<NodeJS.Timeout | null>(null);
    const setCustomerData = useCustomerStore((state) => state.setCustomerData);

    // Format phone number for display
    const formatPhoneNumber = (number: string): string => {
        if (number.length <= 3) return `(${number}`;
        if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
        return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    };

    // Handle number input with haptic feedback
    const handlePress = (num: string) => {
        setPhoneNumber((prev) => {
            if (prev.length >= 10) return prev;
            return prev + num;
        });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // Handle delete button (single tap)
    const handleDelete = () => {
        setPhoneNumber((prev) => prev.slice(0, -1));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    // Start continuous deletion on long press
    const startDeleting = () => {
        deleteInterval.current = setTimeout(() => {
            deleteInterval.current = setInterval(() => {
                setPhoneNumber((prev) => {
                    if (prev.length === 0) {
                        clearInterval(deleteInterval.current!);
                        return prev;
                    }
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    return prev.slice(0, -1);
                });
            }, 100);
        }, 300);
    };

    // Stop continuous deletion
    const stopDeleting = () => {
        if (deleteInterval.current) {
            clearInterval(deleteInterval.current);
            deleteInterval.current = null;
        }
    };

    // Fetch customer by phone number
    const handleEnter = async () => {
        if (phoneNumber.length === 10) {
            const result = await fetchCustomerByPhone(phoneNumber);
            if (result) {
                setCustomerResult(result);
            } else {
                setCustomerResult("notfound");
            }
        }
    };

    // Handle press on customer card to navigate to profile
    const handleCustomerPress = async (customer: Customer) => {
        if (!customer.id) {
            console.error("Customer ID is missing!");
            return;
        }

        const updatedCustomer = await fetchCustomerById(customer.id); // ✅ Use ID, NOT phone_number
        if (!updatedCustomer) return;

        // Update the global customer store
        setCustomerData({
            store_id: updatedCustomer.store_id,
            phone_number: updatedCustomer.phone_number,
            name: updatedCustomer.name,
            avatar_name: updatedCustomer.avatar_name,
            current_points: updatedCustomer.current_points,
            lifetime_points: updatedCustomer.lifetime_points,
            total_visits: updatedCustomer.total_visits,
            last_visit: updatedCustomer.last_visit,
            membership_level: updatedCustomer.membership_level,
            is_active: updatedCustomer.is_active,
            joined_date: updatedCustomer.joined_date,
        });

        // Navigate to the profile screen
        router.push({
            pathname: "/(root)/(handler)/(user)/userProfile",
            params: {
                name: updatedCustomer.name,
                current_points: updatedCustomer.current_points?.toString() || "0",
                last_visit: updatedCustomer.last_visit,
                total_visits: updatedCustomer.total_visits,
                membership_level: updatedCustomer.membership_level,
                avatar_name: updatedCustomer.avatar_name,
                phone_number: updatedCustomer.phone_number,
                member_since: updatedCustomer.joined_date,
                lifetime_points: updatedCustomer.lifetime_points?.toString() || "0",
            },
        });
    };

    return (
        <View className="w-full flex-1 h-full flex flex-row items-center justify-center relative">

            {/* Back Button */}
            <BackButton />


            {/* Left Side: Phone Input & Keypad */}
            <View className="w-1/2 h-full flex-1 flex items-center justify-center bg-lime-300">
                <Text className="text-black text-4xl font-bold mb-6">Lookup Customer</Text>

                {/* Phone Input */}
                <View className="w-full max-w-sm bg-gray-800 rounded-lg px-4 py-3 border border-gray-600 mb-6">
                    <TextInput
                        value={phoneNumber.length > 0 ? formatPhoneNumber(phoneNumber) : "(904) 000-0000"}
                        className={`text-3xl font-bold tracking-widest text-center ${phoneNumber.length > 0 ? "text-white" : "text-gray-500"
                            }`}
                        keyboardType="number-pad"
                        editable={false}
                    />
                </View>

                {/* Keypad */}
                <View className="flex flex-row flex-wrap justify-center w-[240px] gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePress(num.toString())}
                            className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                        >
                            <Text className="text-3xl font-bold text-white">{num}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Delete Button */}
                    <TouchableOpacity
                        onPress={handleDelete}
                        onPressIn={startDeleting}
                        onPressOut={stopDeleting}
                        className="w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <X size={32} color="white" />
                    </TouchableOpacity>

                    {/* Zero Button */}
                    <TouchableOpacity
                        onPress={() => handlePress("0")}
                        className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <Text className="text-3xl font-bold text-white">0</Text>
                    </TouchableOpacity>

                    {/* Enter Button */}
                    <TouchableOpacity
                        onPress={handleEnter}
                        disabled={phoneNumber.length < 10}
                        className={`w-20 h-20 rounded-xl flex items-center justify-center shadow-lg ${phoneNumber.length === 10 ? "bg-green-600" : "bg-gray-400 opacity-50"
                            }`}
                    >
                        <BadgeCheck size={40} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Right Side: Display Customer Result */}
            <View className="w-1/2 h-full flex-1 flex items-center justify-center bg-orange-400">
                {customerResult === null ? (
                    <Text className="text-[24px] text-white font-bold  px-4">Enter a phone number to search.</Text>
                ) : customerResult === "notfound" ? (
                    <Text className="text-[24px] text-white font-bold text-center  px-4">
                        User not found. Please use the client device to sign up that customer.
                    </Text>
                ) : (
                    <Pressable
                        onPress={() => handleCustomerPress(customerResult)}
                        className="bg-white p-6 rounded-xl shadow-md"
                    >
                        <Image
                            source={getAvatar(customerResult.avatar_name || "")}
                            className="w-20 h-20 rounded-full mb-4"
                            resizeMode="contain"
                        />
                        <Text className="text-2xl font-bold text-gray-900">{customerResult.name}</Text>
                        <Text className="text-lg text-gray-700">{customerResult.phone_number}</Text>
                        <Text className="text-lg text-gray-700">Points: {customerResult.current_points || 0}</Text>
                        <Text className="text-lg text-gray-700">Membership: {customerResult.membership_level || "N/A"}</Text>
                        <Text className="text-lg text-gray-700">
                            Last Visit: {customerResult.last_visit ? new Date(customerResult.last_visit).toLocaleDateString() : "N/A"}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}