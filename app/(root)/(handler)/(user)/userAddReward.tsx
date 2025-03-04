import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Delete } from "lucide-react-native"; // Delete (X) icon
import { useRewardStore } from "@/stores/rewardStore";

type RootStackParamList = {
    UserRewardSummary: undefined;
};

export default function UserAddReward() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [points, setPoints] = useState(""); // Store the numeric input

    // Get the setter from the reward store to store earned points
    const setEarnedPoints = useRewardStore((state) => state.setEarnedPoints);

    // Handle number input: append the pressed digit
    const handlePress = (num: string) => {
        setPoints((prev) => prev + num);
    };

    // Handle delete button: remove the last digit
    const handleDelete = () => {
        setPoints((prev) => prev.slice(0, -1));
    };

    // Handle submit: store the earned points and navigate
    const handleSubmit = () => {
        if (points) {
            setEarnedPoints(Number(points));
            navigation.navigate("UserRewardSummary");
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-white px-6 py-16">
            {/* Title */}
            <Text className="text-black text-4xl font-bold mb-6">Add Points</Text>

            {/* Display Input */}
            <View className="flex-row items-center justify-between w-full max-w-xs border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
                <Text className="text-black text-3xl font-bold">{points || "0"}</Text>
                <TouchableOpacity onPress={handleDelete} className="p-2">
                    <Delete size={28} color="black" />
                </TouchableOpacity>
            </View>

            {/* Keypad */}
            <View className="flex-1 justify-center items-center mt-6">
                <View className="flex flex-row flex-wrap justify-center w-[240px] gap-4">
                    {/* First Row */}
                    {[1, 2, 3].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePress(num.toString())}
                            className="w-20 h-20 bg-white border border-gray-400 rounded-lg flex items-center justify-center shadow-lg"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.3,
                                shadowRadius: 5,
                                elevation: 5,
                            }}
                        >
                            <Text className="text-3xl font-bold text-black">{num}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Second Row */}
                    {[4, 5, 6].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePress(num.toString())}
                            className="w-20 h-20 bg-white border border-gray-400 rounded-lg flex items-center justify-center shadow-lg"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.3,
                                shadowRadius: 5,
                                elevation: 5,
                            }}
                        >
                            <Text className="text-3xl font-bold text-black">{num}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Third Row */}
                    {[7, 8, 9].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePress(num.toString())}
                            className="w-20 h-20 bg-white border border-gray-400 rounded-lg flex items-center justify-center shadow-lg"
                            style={{
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.3,
                                shadowRadius: 5,
                                elevation: 5,
                            }}
                        >
                            <Text className="text-3xl font-bold text-black">{num}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Fourth Row: Zero & Submit */}
                    <TouchableOpacity
                        onPress={() => handlePress("0")}
                        className="w-20 h-20 bg-white border border-gray-400 rounded-lg flex items-center justify-center shadow-lg"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.3,
                            shadowRadius: 5,
                            elevation: 5,
                        }}
                    >
                        <Text className="text-3xl font-bold text-black">0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!points}
                        className={`flex-1 h-20 px-4 rounded-lg flex items-center justify-center shadow-lg ${points ? "bg-green-600" : "bg-gray-400 opacity-50"
                            }`}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.4,
                            shadowRadius: 5,
                            elevation: 6,
                        }}
                    >
                        <Text className="text-white font-bold text-2xl uppercase">Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}