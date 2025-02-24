import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LockKeyhole, Check } from "lucide-react-native";
import { fetchRewards, Reward } from "@/utils/actions";
import { useCustomerStore } from "@/stores/customerStore";
import { useRewardStore } from "@/stores/rewardStore"; // <-- new store

type RootStackParamList = {
    UserAddReward: undefined;
};

export default function UserRewardSelect() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const customer = useCustomerStore();

    // Get the setter from our new reward store
    const setSelectedRewardInStore = useRewardStore((state) => state.setSelectedReward);

    const [selectedReward, setSelectedReward] = useState<number | null>(null);
    const [rewards, setRewards] = useState<Reward[]>([]);

    // Fetch rewards on mount
    useEffect(() => {
        const loadRewards = async () => {
            const fetchedRewards = await fetchRewards();
            setRewards(fetchedRewards);
        };
        loadRewards();
    }, []);

    // If no customer data is available, show fallback
    if (!customer.phone_number) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6 py-16">
                <Text className="text-black text-2xl">No customer data available.</Text>
            </View>
        );
    }

    function getPriority(item: Reward) {
        // 0-point reward first
        if ((item.unlock_points ?? 0) === 0 && item.reward_type !== "promo") {
            return 0;
        }
        // then promos
        if (item.reward_type === "promo") {
            return 1;
        }
        // everything else afterward
        return 2;
    }

    return (
        <View className="w-full flex-1 items-center justify-center bg-white px-6 py-16">
            {/* Title */}
            <Text className="text-black text-4xl font-bold mb-6">Redeem Rewards</Text>

            <View className="w-full max-w-lg h-[80%] rounded-3xl bg-gray-100">
                {/* Rewards List */}
                <FlatList
                    data={[...rewards].sort((a, b) => {
                        // Compare priorities
                        const aPriority = getPriority(a);
                        const bPriority = getPriority(b);

                        if (aPriority !== bPriority) {
                            return aPriority - bPriority;
                        }

                        // If same priority (e.g., two promos or two non-promos), 
                        // then sort by unlock_points ascending
                        return (a.unlock_points ?? 0) - (b.unlock_points ?? 0);
                    })}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="gap-y-4 w-full px-6 py-6"
                    renderItem={({ item }) => {
                        // Check if reward should be locked
                        const isLocked =
                            item.reward_type !== "promo" &&
                            item.unlock_points != null &&
                            (customer.current_points || 0) < item.unlock_points;

                        return (
                            <TouchableOpacity
                                disabled={isLocked}
                                onPress={() => setSelectedReward(item.id)}
                                className={`flex-row items-center justify-between border-[3px] ${selectedReward === item.id ? "border-blue-600" : "border-gray-300"
                                    } px-4 py-4 rounded-2xl ${isLocked ? "opacity-50 brightness-75" : "bg-white"
                                    }`}
                            >
                                <View className="items-center gap-y-1">
                                    <Text className="text-2xl font-bold text-black">{item.reward_name}</Text>
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
                onPress={() => {
                    const selectedRewardObj = rewards.find((r) => r.id === selectedReward);
                    if (!selectedRewardObj) return; // ensure it's defined

                    // Store the chosen reward in the reward store
                    setSelectedRewardInStore(selectedRewardObj);

                    // Then navigate to UserAddReward
                    navigation.navigate("UserAddReward");
                }}
                disabled={!selectedReward}
                className={`mt-6 w-full max-w-md px-6 py-4 rounded-xl ${selectedReward ? "bg-green-600" : "bg-gray-400 opacity-50"
                    }`}
            >
                <Text className="text-white font-bold text-xl text-center">Next</Text>
            </TouchableOpacity>
        </View>
    );
}