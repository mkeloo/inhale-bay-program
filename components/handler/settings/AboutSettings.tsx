import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { fetchStores } from "@/utils/actions";
import { Store } from "@/types/type";

const STORE_CODE = "5751"; // Hardcoded Store Code

export default function AboutSettings() {
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const stores = await fetchStores();
                const matchedStore = stores.find((s) => s.store_code === STORE_CODE);

                if (!matchedStore) {
                    setError("No store found for this code.");
                } else {
                    setStore(matchedStore);
                }
            } catch (err) {
                console.error("Error fetching store data:", err);
                setError("Error fetching store data");
            }
            setLoading(false);
        })();
    }, []);

    return (
        <View className="w-full flex-1 flex items-center border-[3px] border-gray-300 rounded-xl p-8 bg-white shadow-lg">
            {/* Loading State */}
            {loading && (
                <View className="items-center justify-center">
                    <ActivityIndicator size="large" color="gray" />
                    <Text className="text-xl text-gray-600 mt-4">
                        Fetching store information...
                    </Text>
                </View>
            )}

            {/* Error State */}
            {!loading && error && (
                <View className="items-center justify-center">
                    <Text className="text-xl text-red-600">{error}</Text>
                </View>
            )}

            {/* Store Info (only if no error & not loading) */}
            {!loading && !error && store && (
                <View className="w-full flex items-center justify-center">
                    <Text className="text-5xl font-bold mb-8 text-gray-900 text-center py-4">
                        {store.store_name}
                    </Text>

                    <View className="w-full max-w-2xl gap-y-6">
                        <View className="w-full flex flex-row items-center justify-between gap-x-4">
                            {/* Email */}
                            <View className="w-1/2">
                                <Text className="text-2xl font-semibold text-gray-800">Email</Text>
                                <View className="border border-gray-400 rounded-lg p-4 mt-2 bg-gray-100">
                                    <Text className="text-2xl text-gray-700 font-semibold">{store.email}</Text>
                                </View>
                            </View>

                            {/* Phone Number */}
                            <View className="w-1/2">
                                <Text className="text-2xl font-semibold text-gray-800">Phone Number</Text>
                                <View className="border border-gray-400 rounded-lg p-4 mt-2 bg-gray-100">
                                    <Text className="text-2xl text-gray-700 font-semibold">{store.phone_number}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Address */}
                        <View>
                            <Text className="text-2xl font-semibold text-gray-800">Address</Text>
                            <View className="border border-gray-400 rounded-lg p-4 mt-2 bg-gray-100">
                                <Text className="text-2xl text-gray-700 font-semibold">{store.address}</Text>
                            </View>
                        </View>

                        {/* City/State/Country */}
                        <View className="flex flex-row gap-x-4">
                            <View className="flex-1">
                                <Text className="text-2xl font-semibold text-gray-800">City</Text>
                                <View className="border border-gray-400 rounded-lg p-4 mt-2 bg-gray-100">
                                    <Text className="text-2xl text-gray-700 font-semibold">{store.city}</Text>
                                </View>
                            </View>

                            <View className="flex-1">
                                <Text className="text-2xl font-semibold text-gray-800">State</Text>
                                <View className="border border-gray-400 rounded-lg p-4 mt-2 bg-gray-100">
                                    <Text className="text-2xl text-gray-700 font-semibold">{store.state}</Text>
                                </View>
                            </View>

                            <View className="flex-1">
                                <Text className="text-2xl font-semibold text-gray-800">Country</Text>
                                <View className="border border-gray-400 rounded-lg p-4 mt-2 bg-gray-100">
                                    <Text className="text-2xl text-gray-700 font-semibold">{store.country}</Text>
                                </View>
                            </View>
                        </View>

                        {/* ZIP Code */}
                        <View>
                            <Text className="text-2xl font-semibold text-gray-800">
                                ZIP Code
                            </Text>
                            <View className="border border-gray-400 rounded-lg p-4 mt-2 bg-gray-100">
                                <Text className="text-2xl text-gray-700 font-semibold">{store.zip_code}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}