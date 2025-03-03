import { View, Text, Pressable, Image, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { getAvatar } from '@/utils/functions';
import { useCustomerStore } from '@/stores/customerStore';
import { Customer, RecentVisit } from '@/types/type';
import { fetchCustomerById, fetchStoreIdByCode, logRecentVisit, sendHandlerDeviceInfo, sendHandlerHeartbeat } from '@/utils/actions';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import * as Battery from 'expo-battery';
import { Search } from 'lucide-react-native';


export default function HandlerHomeScreen() {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [refreshing, setRefreshing] = useState(false); // Refresh state
    const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
    const setCustomerData = useCustomerStore((state) => state.setCustomerData);

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
    // State & Effect Hook for Handler Heartbeat (Only Active Screens)
    // ───────────────────────────────────────────────────────────
    useFocusEffect(
        useCallback(() => {
            if (!storeId) return;

            // Start heartbeat when screen is focused
            const interval = setInterval(() => {
                sendHandlerHeartbeat(storeId, "handler_dashboard", "📡 Sending heartbeat...");
            }, 5000);

            return () => {
                sendHandlerHeartbeat(storeId, "handler_dashboard", "❌ Stopping heartbeat...");
                clearInterval(interval);
            };
        }, [storeId])
    );


    // ───────────────────────────────────────────────────────────
    // State & Effect Hook for Device Info (WiFi & Battery)
    // ───────────────────────────────────────────────────────────
    useFocusEffect(
        useCallback(() => {
            if (!storeId) return;

            const sendDeviceInfo = async () => {
                const netInfo = await NetInfo.fetch();
                const batteryLevel = await Battery.getBatteryLevelAsync();

                // Ensure `netInfo.details` is properly typed
                const details = netInfo.details as any || {};

                // Safely extract IP address (only exists in WiFi mode)
                const ipAddress = netInfo.type === "wifi" && details?.ipAddress
                    ? details.ipAddress
                    : "N/A";

                sendHandlerDeviceInfo(
                    storeId,
                    netInfo.type === "wifi" && details?.strength !== undefined
                        ? `${details.strength} dBm`
                        : "N/A",
                    ipAddress, // ✅ Now safely extracted
                    netInfo.type || "unknown",
                    netInfo.isConnected ?? false,
                    netInfo.type === "cellular" ? details?.cellularGeneration || "Unknown" : "N/A",
                    netInfo.type === "cellular" ? details?.carrier || "Unknown" : "N/A",
                    Math.round(batteryLevel * 100) // Convert to percentage
                );
            };

            // Initial send
            sendDeviceInfo();

            // Start interval for periodic updates
            const interval = setInterval(() => {
                sendDeviceInfo();
            }, 5000);

            return () => clearInterval(interval); // Cleanup on unmount
        }, [storeId])
    );

    // Fetch recent visits rows and attach customer info via customer_id
    const fetchRecentVisits = useCallback(async () => {
        setRefreshing(true); // Start refreshing

        const { data, error } = await supabase
            .from('recent_visits')
            .select(`
        id,
        last_visit,
        customer_id,
        phone_number,
        store_id
      `)
            .order('last_visit', { ascending: false })
            .limit(8);
        if (error) {
            // console.error('Error fetching recent visits:', error);
        } else if (data) {
            // For each recent visit row, fetch the corresponding customer info
            const visitsWithCustomer = await Promise.all(
                (data as RecentVisit[]).map(async (visit) => {
                    const customerData = await fetchCustomerById(visit.customer_id as string);
                    return {
                        ...visit,
                        // Attach the complete customer object rather than a subset
                        customer: customerData ? [customerData] : [],
                    };
                })
            );
            setRecentVisits(visitsWithCustomer);
        }
        setRefreshing(false); // Stop refreshing
    }, []);

    useEffect(() => {
        fetchRecentVisits();
    }, [fetchRecentVisits]);

    // Pull to Refresh Handler
    const onRefresh = useCallback(() => {
        fetchRecentVisits();
    }, []);

    // Subscribe to realtime changes on recent_visits
    useEffect(() => {
        const recentChannel = supabase
            .channel('recent-visits-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'recent_visits' },
                (payload: any) => {
                    // console.log('Recent visits changed:', payload);
                    fetchRecentVisits();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(recentChannel);
        };
    }, [fetchRecentVisits]);

    // Subscribe to changes in the customers table (for current customer updates)
    useEffect(() => {
        const channel = supabase
            .channel('customers-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'customers' },
                async (payload: any) => {
                    // console.log('New customer inserted:', payload.new);
                    setCustomer(payload.new);
                    setCustomerData({
                        store_id: payload.new.store_id,
                        phone_number: payload.new.phone_number,
                        name: payload.new.name,
                        avatar_name: payload.new.avatar_name,
                        current_points: payload.new.current_points,
                        lifetime_points: payload.new.lifetime_points,
                        total_visits: payload.new.total_visits,
                        last_visit: payload.new.last_visit,
                        membership_level: payload.new.membership_level,
                        is_active: payload.new.is_active,
                        joined_date: payload.new.joined_date,
                    });
                    // Log the visit only once on INSERT
                    await logRecentVisit(payload.new.id, payload.new.phone_number, payload.new.store_id);
                    fetchRecentVisits();
                }
            )
            // Optionally, you can subscribe to UPDATE events without logging a visit
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'customers' },
                async (payload: any) => {
                    // console.log('Customer updated:', payload.new);
                    setCustomer(payload.new);
                    setCustomerData({
                        store_id: payload.new.store_id,
                        phone_number: payload.new.phone_number,
                        name: payload.new.name,
                        avatar_name: payload.new.avatar_name,
                        current_points: payload.new.current_points,
                        lifetime_points: payload.new.lifetime_points,
                        total_visits: payload.new.total_visits,
                        last_visit: payload.new.last_visit,
                        membership_level: payload.new.membership_level,
                        is_active: payload.new.is_active,
                        joined_date: payload.new.joined_date,
                    });
                    await logRecentVisit(payload.new.id, payload.new.phone_number, payload.new.store_id);
                    fetchRecentVisits();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [setCustomerData, fetchRecentVisits]);

    // Navigate to the customer's profile when a visit card is pressed.
    const handleCustomerPress = async (visit: RecentVisit) => {
        // Refetch the customer details to ensure they're up-to-date.
        const updatedCustomer = await fetchCustomerById(visit.customer_id as string);
        if (!updatedCustomer) return;

        // Update the global customer store with the full customer data.
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

        // Then navigate to the profile screen with the updated details.
        router.push({
            pathname: '/(root)/(handler)/(user)/userProfile',
            params: {
                name: updatedCustomer.name,
                current_points: updatedCustomer.current_points ? updatedCustomer.current_points.toString() : '0',
                last_visit: updatedCustomer.last_visit,
                total_visits: updatedCustomer.total_visits,
                membership_level: updatedCustomer.membership_level,
                avatar_name: updatedCustomer.avatar_name,
                phone_number: updatedCustomer.phone_number,
                member_since: updatedCustomer.joined_date,
                lifetime_points: updatedCustomer.lifetime_points ? updatedCustomer.lifetime_points.toString() : '0',
            },
        });
        // console.log('Navigating to user profile:', cust);
    };

    return (
        <View className="flex-1 items-center justify-center">
            <View className="flex items-center justify-center gap-y-4 w-full">
                <Text className="text-4xl my-4">Handler Home Screen</Text>
                <View className="flex flex-row items-center justify-center gap-x-10">
                    <View className="flex items-center justify-center gap-y-4">
                        <Pressable
                            onPress={() => router.push('/welcome')}
                            className="bg-yellow-500 p-4 w-56 rounded-xl"
                        >
                            <Text className="text-white text-2xl text-center">Home Route</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => router.push('/(root)/(handler)/handlerConfirm')}
                            className="bg-cyan-500 p-4 w-56 rounded-xl"
                        >
                            <Text className="text-white text-2xl text-center">Handler Screen</Text>
                        </Pressable>

                        {/* Refresh Button - Reloads the Screen */}
                        <Pressable
                            onPress={onRefresh} // Calls the refresh function
                            className="bg-green-500 p-4 w-56 rounded-xl"
                        >
                            <Text className="text-white text-2xl text-center">Refresh</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push('/(root)/(handler)/(misc)/search')}
                            className="bg-purple-500 p-4 w-56 rounded-xl flex flex-row items-center justify-center gap-x-5"
                        >
                            <Search size={35} color="yellow" />
                            <Text className="text-white text-2xl text-center">
                                Search
                            </Text>
                        </Pressable>
                    </View>

                    {/* Current Customer on Client SideC */}
                    {customer && (
                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname: '/(root)/(handler)/(user)/userProfile',
                                    params: {
                                        name: customer.name,
                                        current_points: customer.current_points
                                            ? customer.current_points.toString()
                                            : '0',
                                        last_visit: customer.last_visit,
                                        total_visits: customer.total_visits,
                                        membership_level: customer.membership_level,
                                        avatar_name: customer.avatar_name,
                                        phone_number: customer.phone_number,
                                        member_since: customer.joined_date,
                                        lifetime_points: customer.lifetime_points
                                            ? customer.lifetime_points.toString()
                                            : '0',
                                    },
                                })
                            }
                            className="items-center justify-center bg-blue-200 rounded-lg border border-gray-300 p-4"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.15,
                                shadowRadius: 3,
                                elevation: 3,
                            }}
                        >
                            <View className="w-36 h-36 rounded-lg overflow-hidden mb-2">
                                {customer.avatar_name ? (
                                    <Image
                                        source={getAvatar(customer.avatar_name)}
                                        className="w-full h-full"
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View className="flex-1 bg-gray-300 items-center justify-center">
                                        <Text className="text-white">N/A</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-blue-600 text-2xl font-bold">
                                {customer.name}
                            </Text>
                        </Pressable>
                    )}
                </View>
                <View className="w-full mt-6">
                    <View className="flex-row justify-between px-4">
                        <Text className="text-lg font-bold">Recent</Text>
                        <Text className="text-lg font-bold">Old</Text>
                    </View>
                    <View className="mt-4">
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        >
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            >
                                {recentVisits.map((visit) => (
                                    <Pressable
                                        key={visit.id}
                                        onPress={() => handleCustomerPress(visit)}
                                        className="mr-4 items-center justify-center bg-blue-100 rounded-lg border border-gray-300 p-4"
                                        style={{
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 3,
                                            elevation: 3,
                                        }}
                                    >
                                        <View className="w-20 h-20 rounded-lg overflow-hidden mb-2">
                                            {visit.customer[0]?.avatar_name ? (
                                                <Image
                                                    source={getAvatar(visit.customer[0].avatar_name)}
                                                    className="w-full h-full"
                                                    resizeMode="contain"
                                                />
                                            ) : (
                                                <View className="flex-1 bg-gray-300 items-center justify-center">
                                                    <Text className="text-white">N/A</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-blue-600 text-base font-bold">
                                            {visit.customer[0]?.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    );
}