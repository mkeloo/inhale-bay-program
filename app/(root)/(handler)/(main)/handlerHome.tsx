import { View, Text, Pressable, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabase';
import { getAvatar } from '@/utils/functions';
import { useCustomerStore } from '@/stores/customerStore';

export default function HandlerHomeScreen() {
    // Local state (optional) and the global setter from the store
    const [customer, setCustomer] = useState<any>(null);
    const setCustomerData = useCustomerStore((state) => state.setCustomerData);

    useEffect(() => {
        // Create a realtime channel for changes on the "customers" table
        const channel = supabase
            .channel('customers-changes')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'customers' },
                (payload: any) => {
                    console.log('New customer inserted:', payload.new);
                    setCustomer(payload.new);
                    // Update the global store with the full customer data
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
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'customers' },
                (payload: any) => {
                    console.log('Customer updated:', payload.new);
                    setCustomer(payload.new);
                    // Update the global store with the new customer data
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
                }
            )
            .subscribe();

        // Cleanup the subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [setCustomerData]);

    return (
        <View className="flex-1 items-center justify-center">
            <View className="flex items-center justify-center gap-y-4">
                <Text className="text-4xl my-4">Handler Home Screen</Text>
                <View className="flex flex-row items-center justify-center gap-x-10">
                    <View className="flex items-center justify-center gap-y-4">
                        <Pressable
                            onPress={() => router.push('/welcome')}
                            className="bg-yellow-500 p-4 rounded-xl"
                        >
                            <Text className="text-white text-2xl">Home Route</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push('/(root)/(handler)/handlerConfirm')}
                            className="bg-cyan-500 p-4 rounded-xl"
                        >
                            <Text className="text-white text-2xl">Handler Screen</Text>
                        </Pressable>
                    </View>

                    {customer && (
                        <Pressable
                            onPress={() => {
                                router.push({
                                    pathname: '/(root)/(handler)/(user)/userProfile',
                                    params: {
                                        name: customer.name,
                                        current_points: customer.current_points.toString(),
                                        last_visit: customer.last_visit,
                                        total_visits: customer.total_visits,
                                        membership_level: customer.membership_level,
                                        avatar_name: customer.avatar_name,
                                        phone_number: customer.phone_number,    // pass phone number
                                        member_since: customer.joined_date,       // pass join date
                                        lifetime_points: customer.lifetime_points.toString(),
                                    },
                                });
                            }}
                            className="items-center justify-center bg-blue-200 rounded-lg border border-gray-300 p-4"
                            style={{
                                shadowColor: "#000",
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
            </View>
        </View>
    );
}