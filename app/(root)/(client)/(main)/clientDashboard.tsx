import { View, Text, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import BackButton from '@/components/shared/BackButton';
import RewardCard from '@/components/shared/RewardCard';
import TimerButton from '@/components/client/TimerButton';
import { useCustomerStore } from '@/stores/customerStore';
import { insertCustomer, fetchCustomerByPhone, fetchRewards, Reward } from '@/utils/actions';

// Example User Points (This will be fetched from state or backend in real use)
const currentUser = {
    id: 1,
    name: 'John Doe',
    phone_number: '1234567890',
    current_points: 100,
};

export default function ClientDashboardScreen() {
    const { phone_number, name, avatar_name, store_id } = useCustomerStore();
    const [customerExists, setCustomerExists] = useState(false);
    const [rewards, setRewards] = useState<Reward[]>([]); // Specify the type for rewards

    // Fetch rewards from the server using fetchRewards
    useEffect(() => {
        const loadRewards = async () => {
            const fetchedRewards = await fetchRewards();
            setRewards(fetchedRewards);
        };
        loadRewards();
    }, []);

    // Check and insert customer if necessary
    useEffect(() => {
        const checkAndInsertCustomer = async () => {
            if (!phone_number || !name || !store_id) return;

            const existingCustomer = await fetchCustomerByPhone(phone_number);
            if (!existingCustomer) {
                await insertCustomer({ store_id, phone_number, name, avatar_name });
                setCustomerExists(true);
            } else {
                setCustomerExists(true);
            }
        };

        checkAndInsertCustomer();
    }, [phone_number, name, store_id]);

    return (
        <View className="flex-1 py-20 bg-blue-100">
            {/* Back Button */}
            <BackButton />

            {/* User Information Display */}
            <View className="absolute top-4 left-4 p-4 bg-white rounded-lg shadow-md">
                <Text className="text-lg font-bold text-gray-900">User Info:</Text>
                <Text className="text-gray-700">📞 {phone_number || "N/A"}</Text>
                <Text className="text-gray-700">👤 {name || "N/A"}</Text>
                <Text className="text-gray-700">🖼️ Avatar: {avatar_name || "N/A"}</Text>
            </View>

            {/* Current Points Display */}
            <View className="absolute top-0 right-0 my-8 mx-8">
                <View
                    className="flex flex-row items-center justify-center bg-slate-700 border-4 border-slate-700 gap-x-2 rounded-3xl py-2 px-3"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}
                >
                    <Image
                        source={require('../../../../assets/images/screen/reward/coin.png')}
                        className="w-10 h-10"
                    />
                    <Text className="font-bold text-2xl text-gray-100">
                        {currentUser.current_points}
                    </Text>
                </View>
            </View>

            {/* Rewards Section */}
            <View className="mt-6 w-full h-4/5 flex items-center justify-center">
                <View className="my-4">
                    <Text className="text-6xl font-bold text-gray-900 px-5 py-4">
                        {(() => {
                            const unlockableRewards = rewards.filter(
                                (r) => r.reward_type !== 'promo' && r.unlock_points !== undefined
                            );
                            const minUnlockPoints =
                                unlockableRewards.length > 0
                                    ? Math.min(...unlockableRewards.map((r) => r.unlock_points!))
                                    : Infinity;

                            return currentUser.current_points < minUnlockPoints
                                ? "Unlock these great rewards!"
                                : "Tell us what you'd like!";
                        })()}
                    </Text>
                </View>

                {/* Horizontal Scrollable List */}
                <FlatList
                    data={[...rewards].sort((a, b) =>
                        a.reward_type === 'promo' && b.reward_type !== 'promo' ? -1 : 1
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="flex items-center justify-center px-20 gap-x-8 pt-20"
                    renderItem={({ item }) => {
                        const isLocked =
                            item.reward_type !== 'promo' &&
                            item.unlock_points !== undefined &&
                            item.unlock_points !== null && currentUser.current_points < item.unlock_points;

                        return (
                            <View className="px-2">
                                <RewardCard
                                    title={item.title}
                                    rewardName={item.reward_name} // Correct property mapping
                                    reward_type={item.reward_type}
                                    unlock_points={item.unlock_points}
                                    days_left={item.days_left}
                                    isLocked={isLocked}
                                />
                            </View>
                        );
                    }}
                />
            </View>

            {/* Timer Button */}
            <View className="w-full h-1/5 flex items-center justify-start">
                <TimerButton
                    title="Done"
                    route="/(root)/(client)/(main)/(signup)/clientPhone"
                    duration={50}
                />
            </View>
        </View>
    );
}