import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LockKeyhole, Check } from "lucide-react-native";
import { rewards } from "@/lib/data"; // Assuming rewards are stored here

// Example User Points (This will be fetched from state or backend in real use)
const currentUser = {
    current_points: 250, // Change this to test locking/unlocking
};

type RootStackParamList = {
    UserAddReward: undefined;
};

export default function UserRewardSelect() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [selectedReward, setSelectedReward] = useState<number | null>(null);

    return (
        <View className="w-full flex-1 items-center justify-center bg-white px-6 py-16">
            {/* Title */}
            <Text className="text-black text-4xl font-bold mb-6">Redeem Rewards</Text>

            <View className="w-full max-w-lg h-[80%] rounded-3xl bg-gray-100">
                {/* Rewards List */}
                <FlatList
                    data={[...rewards].sort((a, b) => (a.reward_type === "promo" ? -1 : 1))}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="gap-y-4 w-full px-6 py-6"
                    renderItem={({ item }) => {
                        const isLocked =
                            item.reward_type !== "promo" &&
                            item.unlock_points !== undefined &&
                            currentUser.current_points < item.unlock_points;

                        return (
                            <TouchableOpacity
                                disabled={isLocked}
                                onPress={() => setSelectedReward(item.id)}
                                className={`flex-row items-center justify-between border-[3px] ${selectedReward === item.id ? "border-blue-600" : "border-gray-300"
                                    } px-4 py-4 rounded-2xl ${isLocked ? "opacity-50 brightness-75" : "bg-white"}`}
                            >
                                <View className="items-center gap-y-1">
                                    <Text className="text-2xl font-bold text-black">{item.name}</Text>
                                    {item.reward_type === "promo" ? (
                                        <Text className="w-full text-green-600 text-xl font-bold">
                                            Promo ({item.days_left} days left)
                                        </Text>
                                    ) : (
                                        <View className="w-full flex-row items-center gap-x-1">
                                            <Image
                                                source={require("../../../../assets/images/screen/reward/coin.png")}
                                                className="w-10 h-10"
                                            />
                                            <Text className="text-2xl font-bold text-amber-600 mb-1">
                                                {item.unlock_points}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Lock Icon for Locked Rewards */}
                                {isLocked ? (
                                    <LockKeyhole size={35} color="gray" strokeWidth={2} />
                                ) : (
                                    selectedReward === item.id && <Check size={35} color="green" strokeWidth={3} />
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Next Button */}
            <TouchableOpacity
                onPress={() => navigation.navigate("UserAddReward")}
                disabled={!selectedReward}
                className={`mt-6 w-full max-w-md px-6 py-4 rounded-xl ${selectedReward ? "bg-green-600" : "bg-gray-400 opacity-50"
                    }`}
            >
                <Text className="text-white font-bold text-xl text-center">Next</Text>
            </TouchableOpacity>
        </View>
    );
}