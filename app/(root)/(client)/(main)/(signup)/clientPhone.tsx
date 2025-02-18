import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { X, BadgeCheck } from "lucide-react-native";

const dummyPhoneNumber = "0000000000";

export default function ClientPhoneScreen() {
    const [phoneNumber, setPhoneNumber] = useState("");


    // Handle number input
    const handlePress = (num: string) => {
        setPhoneNumber((prev) => (prev.length < 10 ? prev + num : prev));
    };

    // Handle delete button
    const handleDelete = () => {
        setPhoneNumber((prev) => prev.slice(0, -1));
    };

    // Handle enter
    const handleEnter = () => {
        if (phoneNumber.length === 10) {
            if (phoneNumber === dummyPhoneNumber) {
                // If phone exists, go straight to the dashboard
                router.push("/(root)/(client)/(main)/clientDashboard");
            } else {
                // If new phone, continue signup process
                router.push("/(root)/(client)/(main)/(signup)/clientName");
            }
        }
    };
    const formatPhoneNumber = (number: string) => {
        if (number.length <= 3) return `(${number}`;
        if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
        return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    };

    return (
        <View className="flex-1 flex-row bg-gray-900">
            {/* Left Side - Placeholder Image */}
            <View className="w-1/2">
                <Image
                    source={require("../../../../../assets/images/screen/home/home.jpg")}
                    className="w-full h-full object-cover"
                    resizeMode="cover"
                />
            </View>

            {/* Right Side - Input & Keypad */}
            <View className="w-1/2 flex items-center justify-center px-6">
                {/* Title */}
                <Text className="text-white text-4xl font-bold mb-6">Enter Your Phone Number</Text>

                {/* Phone Input */}
                <View className="w-full max-w-sm bg-gray-800 rounded-lg px-4 py-3 border border-gray-600 mb-6">
                    <TextInput
                        value={phoneNumber.length > 0 ? formatPhoneNumber(phoneNumber) : "(904) 000-0000"} // Show placeholder when empty
                        className={`text-3xl font-bold tracking-widest text-center ${phoneNumber.length > 0 ? "text-white" : "text-gray-500"
                            }`}
                        keyboardType="number-pad"
                        editable={false} // Prevent manual input, use only keypad
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

                    {/* Last Row - Zero & Enter */}
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <X size={32} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handlePress.bind(null, "0")}
                        className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                        <Text className="text-3xl font-bold text-white">0</Text>
                    </TouchableOpacity>

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
        </View>
    );
}