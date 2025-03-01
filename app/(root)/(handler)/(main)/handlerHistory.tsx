import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { fetchTransactionHistoryLast3Days } from '@/utils/actions';
import { TransactionWithCustomer } from '@/types/type';
import { getAvatar } from '@/utils/functions';
import { supabase } from '@/utils/supabase';

/**
 * Return a new Date with only the year/month/day from the original.
 * This effectively sets hours/minutes/seconds to 0, ignoring partial days.
 */
function toLocalDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Helper function to format the phone number
const formatPhoneNumber = (phone: string): string => {
    if (!phone) return "N/A";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};


/**
 * Compare only the date portion of `created_at` to "now" (also date-only).
 *   - 0 day difference => "Today"
 *   - 1 day difference => "Yesterday"
 *   - 2 day difference => "Day Before Yesterday"
 *   - fallback => the actual local date string (e.g. "2/27/2025")
 */
function getRelativeDateLabel(dateStr: string): { group: string; dateKey: string } {
    const recordDate = new Date(dateStr);
    const recordDateOnly = toLocalDateOnly(recordDate);

    const now = new Date();
    const nowDateOnly = toLocalDateOnly(now);

    // The local date string fallback (e.g. "2/26/2025")
    const dateKey = recordDateOnly.toLocaleDateString();

    const diffDays = Math.floor(
        (nowDateOnly.getTime() - recordDateOnly.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return { group: 'Today', dateKey };
    if (diffDays === 1) return { group: 'Yesterday', dateKey };
    if (diffDays === 2) return { group: dateKey, dateKey };
    return { group: dateKey, dateKey };
}

export default function HandlerHistoryScreen() {
    const [groupedHistory, setGroupedHistory] = useState<Record<string, TransactionWithCustomer[]>>({});

    // Load & group transactions
    const loadHistory = async () => {
        const data = await fetchTransactionHistoryLast3Days();
        const grouped: Record<string, TransactionWithCustomer[]> = {};

        for (const tx of data) {
            const { group, dateKey } = getRelativeDateLabel(tx.created_at);

            // If group is "Today"/"Yesterday"/"Day Before Yesterday",
            // we append the date in parentheses: "Yesterday (2/27/2025)"
            let compositeKey = group;
            if (group === 'Today' || group === 'Yesterday' || group === 'Day Before Yesterday') {
                compositeKey = `${group} (${dateKey})`;
            }

            if (!grouped[compositeKey]) {
                grouped[compositeKey] = [];
            }
            grouped[compositeKey].push(tx);
        }
        setGroupedHistory(grouped);
    };

    useEffect(() => {
        // Initial load
        loadHistory();

        // Real-time subscription
        const subscription = supabase
            .channel('transaction_updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'customer_transactions' },
                async (payload) => {
                    console.log('Transaction update:', payload);
                    loadHistory();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return (
        <ScrollView className="flex-1 bg-white px-10 py-4 mb-16">
            <Text className="text-5xl text-gray-800 font-bold mb-4 mt-8 w-full text-center">
                History
            </Text>

            {Object.keys(groupedHistory).length === 0 && (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#6B46C1" />
                    <Text className="text-lg text-gray-700 mt-2">Loading transactions...</Text>
                </View>
            )}
            {Object.keys(groupedHistory).map((groupLabel) => (
                <View key={groupLabel} className="mb-8">
                    {/* Date Header */}
                    <Text className="text-3xl text-orange-900 font-bold mb-8 py-3 px-4 w-[400px] bg-orange-100 text-center rounded-2xl">
                        {groupLabel}
                    </Text>

                    {groupedHistory[groupLabel].map((item, index) => {
                        // Just format the time portion
                        const localTime = new Date(item.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        return (
                            <View
                                key={item.id}
                                className={`flex-row items-center justify-between rounded-xl mb-5 px-6 py-2 ${index % 2 === 0 ? 'bg-pink-50' : 'bg-lime-50'
                                    }`}
                            >
                                {/* Left: time + avatar + name/phone */}
                                <View className="flex-row items-center gap-x-5">
                                    {/* Time with background badge */}
                                    <View className="px-3 py-1 bg-blue-100 rounded-full">
                                        <Text className="text-lg font-bold text-blue-800">
                                            {localTime}
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center">
                                        <Image
                                            source={getAvatar(item.avatar_name || '')}
                                            className="w-20 h-20 rounded-full mr-2"
                                            resizeMode="contain"
                                        />
                                        <View>
                                            {/* Name Styling: Bigger & Darker */}
                                            <Text className="text-2xl font-bold text-gray-800">{item.customer_name}</Text>
                                            {/* Formatted Phone Number Styling */}
                                            <Text className="text-xl font-bold text-blue-900">
                                                {formatPhoneNumber(item.phone_number || '')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Right: Transaction Type & Points Badges */}
                                <View className="flex-row items-center gap-x-4 justify-end" style={{ minWidth: 300 }}>
                                    {/* Transaction Type Badge (fixed width ~180px) */}
                                    <View
                                        style={{ width: 180 }}
                                        className={`px-3 py-2 rounded-full items-center ${item.transaction_type === "signup"
                                            ? "bg-green-700"
                                            : item.transaction_type === "visit" && item.points_changed === 0
                                                ? "bg-gray-700"  // Checked In Transaction
                                                : item.transaction_type === "visit"
                                                    ? "bg-orange-600"
                                                    : "bg-pink-700"
                                            }`}
                                    >
                                        <Text className="text-lg text-white font-bold text-center">
                                            {item.transaction_type === "visit" && item.points_changed === 0
                                                ? "Checked In"
                                                : item.transaction_type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                                        </Text>
                                    </View>

                                    {/* Points Badge (fixed width ~130px) */}
                                    <View
                                        style={{ width: 130 }}
                                        className={`px-3 py-2 rounded-full items-center 
                                            ${item.points_changed === 0 ? "bg-yellow-200" : item.points_changed > 0 ? "bg-green-200" : "bg-red-200"}
                                        `}
                                    >
                                        <Text
                                            className={`text-lg font-bold text-center 
                                                ${item.points_changed === 0 ? "text-yellow-900" : item.points_changed > 0 ? "text-green-900" : "text-red-900"}
                                            `}
                                        >
                                            {item.points_changed === 0 ? `0 pts` : item.points_changed > 0 ? `+ ${item.points_changed} pts` : `${item.points_changed} pts`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            ))
            }
        </ScrollView>
    );
}