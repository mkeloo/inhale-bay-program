// ───────────────────────────────────────────────────────────
// Imports
// ───────────────────────────────────────────────────────────
import { View, Text, Image, FlatList } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import BackButton from '@/components/shared/BackButton';
import RewardCard from '@/components/shared/RewardCard';
import TimerButton from '@/components/client/TimerButton';
import { useCustomerStore } from '@/stores/customerStore';
import {
    handleCustomerLogin,
    fetchCustomerByPhone,
    fetchRewards,
    Reward,
    logCustomerTransaction,
    sendClientHeartbeat,
    fetchStoreIdByCode
} from '@/utils/actions';
import { useFocusEffect } from '@react-navigation/native';

// ───────────────────────────────────────────────────────────
// Component: ClientDashboardScreen
// ───────────────────────────────────────────────────────────
export default function ClientDashboardScreen() {
    // ─────────────────────────────────────────────────────────
    // Global & Local State
    // ─────────────────────────────────────────────────────────
    const { phone_number, name, avatar_name, store_id } = useCustomerStore();
    const [storeId, setStoreId] = useState<string | null>(null);
    const [customerExists, setCustomerExists] = useState(false);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [customerData, setCustomerData] = useState<{ current_points: number } | null>(null);

    // Tracks if customer login has already been logged (avoid duplicates)
    const hasLoggedRef = useRef(false);

    // ─────────────────────────────────────────────────────────
    // useEffect: Fetch Store ID for Heartbeat Tracking
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchStoreId = async () => {
            const id = await fetchStoreIdByCode("5751");
            setStoreId(id);
        };
        fetchStoreId();
    }, []);


    // ───────────────────────────────────────────────────────────
    // State & Effect Hook for Heartbeat (Only Active Screens)
    // ───────────────────────────────────────────────────────────
    useFocusEffect(
        useCallback(() => {
            if (!storeId) return;

            // Start heartbeat when screen is focused
            const interval = setInterval(() => {
                sendClientHeartbeat(storeId, "client_dashboard", "📡 Sending heartbeat...");
            }, 5000);

            return () => {
                sendClientHeartbeat(storeId, "client_dashboard", "❌ Stopping heartbeat...");
                clearInterval(interval);
            };
        }, [storeId])
    );


    // ─────────────────────────────────────────────────────────
    // useEffect: Fetch Rewards
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        const loadRewards = async () => {
            const fetchedRewards = await fetchRewards();
            setRewards(fetchedRewards);
        };
        loadRewards();
    }, []);

    // ─────────────────────────────────────────────────────────
    // useEffect: Fetch Customer Data by Phone
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        const loadCustomerData = async () => {
            if (!phone_number) return;
            const fetchedCustomer = await fetchCustomerByPhone(phone_number);
            if (fetchedCustomer) {
                setCustomerData(fetchedCustomer);
            }
        };
        loadCustomerData();
    }, [phone_number]);

    // ─────────────────────────────────────────────────────────
    // useEffect: Check & Log In Customer (Insert/Update)
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        const loginCustomer = async () => {
            if (!phone_number || !name || !store_id) return;
            if (hasLoggedRef.current) return; // Skip if already logged

            const result = await handleCustomerLogin(store_id, phone_number, name, avatar_name);
            if (result) {
                hasLoggedRef.current = true;
                setCustomerExists(true);

                // Determine transaction type: if first visit => 'signup', else => 'visit'
                const transactionType = result.total_visits === 1 ? 'signup' : 'visit';
                logCustomerTransaction(
                    result.store_id,
                    result.id,
                    transactionType,
                    0, // points_changed
                    result.current_points || 0 // net_points
                )
                    .then(() => console.log('Login transaction logged successfully.'))
                    .catch((err) => console.error('Error logging login transaction:', err));
            }
        };

        loginCustomer();
    }, [phone_number, name, store_id, avatar_name]);

    // ─────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────
    return (
        <View className="flex-1 py-20 bg-blue-100">
            {/* Back Button */}
            <BackButton />

            {/* User Information Display */}
            <View className="absolute top-4 left-4 p-4 bg-white rounded-lg shadow-md">
                <Text className="text-lg font-bold text-gray-900">User Info:</Text>
                <Text className="text-gray-700">📞 {phone_number || 'N/A'}</Text>
                <Text className="text-gray-700">👤 {name || 'N/A'}</Text>
                <Text className="text-gray-700">🖼️ Avatar: {avatar_name || 'N/A'}</Text>
            </View>

            {/* Current Points Display */}
            <View className="absolute top-0 right-0 my-8 mx-8">
                <View
                    className="flex flex-row items-center justify-center bg-slate-700 border-4 border-slate-700 gap-x-2 rounded-3xl py-2 px-3"
                    style={{
                        shadowColor: '#000',
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
                        {customerData?.current_points ?? 0}
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

                            return (customerData?.current_points ?? 0) < minUnlockPoints
                                ? 'Unlock these great rewards!'
                                : 'Tell us what you\'d like!';
                        })()}
                    </Text>
                </View>

                {/* Horizontal Scrollable List */}
                <FlatList
                    data={[
                        ...rewards
                            // 1) Filter out "0 reward" items (unless it's a promo with 0 points)
                            .filter((item) => {
                                return !(
                                    (item.unlock_points ?? 0) === 0 &&
                                    item.reward_type !== 'promo'
                                );
                            })
                            // 2) Sort: promos first, then ascending points
                            .sort((a, b) => {
                                // Promo items to the front
                                if (a.reward_type === 'promo' && b.reward_type !== 'promo') return -1;
                                if (b.reward_type === 'promo' && a.reward_type !== 'promo') return 1;

                                // Among the same type, sort by unlock_points ascending
                                return (a.unlock_points ?? 0) - (b.unlock_points ?? 0);
                            })
                    ]}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="flex items-center justify-center px-20 gap-x-8 pt-20"
                    renderItem={({ item }) => {
                        const isLocked =
                            item.reward_type !== 'promo' &&
                            item.unlock_points !== undefined &&
                            item.unlock_points !== null &&
                            (customerData?.current_points ?? 0) < item.unlock_points;

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
                    duration={1000}
                />
            </View>
        </View>
    );
}