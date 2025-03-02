import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Image } from "react-native";


export default function SetupWelcomeScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-slate-900">
            <View className="w-full h-[5%] flex flex-row items-center justify-between px-20 pt-4 ">
                <Text className="text-[20px] text-gray-200 uppercase w-full text-center font-bold tracking-widest">
                    Inhale Bay Smoke Shop
                </Text>
            </View>
            <View className="w-full h-[25%] flex flex-row items-center justify-between px-20 ">
                {/* Logo */}
                {/* <View className="w-[20%] flex items-center justify-center my-4 rounded-2xl">
                    <Image
                        source={require('../../assets/images/screen/logo/ib-logo-2.png')}
                        className="w-44 h-44 rounded-3xl"
                        resizeMode="contain"
                    />
                </View> */}
                <View className="w-full flex items-center justify-center">

                    <Text className="text-[50px] text-white font-bold text-center">
                        Welcome to the Setup Screen
                    </Text>
                    {/* <Pressable
                        onPress={() => router.push("/(root)/(admin)/admin")}
                        className="bg-blue-500 p-4 rounded-xl"
                    >
                        <Text className="text-white text-2xl">Admin Route</Text>
                    </Pressable> */}
                </View>
            </View>

            <View className="w-full h-[70%] flex flex-col gap-y-4 py-10 items-center justify-center bg-slate-900">

                {/* Prompt the user to make a selection */}
                <Text className="text-3xl text-white font-bold text-center">Press a button to select your device type.</Text>

                {/* Navigation Buttons */}
                <View className="w-full h-full flex flex-row items-center justify-between gap-x-6 px-20 py-4">

                    {/* Client Route */}
                    <Pressable
                        onPress={() => router.push("/(root)/(client)/(main)/(signup)/clientPhone")}
                        className="w-1/2 h-full bg-blue-200 flex items-center justify-center rounded-xl border-[3px] border-white active:scale-90 transition-transform duration-150"
                    >
                        <Text className="text-blue-900 text-4xl font-bold">Client Route</Text>
                    </Pressable>

                    {/* Handler Route */}
                    <Pressable
                        onPress={() => router.push("/(root)/(handler)/handlerConfirm")}
                        className="w-1/2 h-full bg-red-200 flex items-center justify-center rounded-xl border-[3px] border-white active:scale-90 transition-transform duration-150"
                    >
                        <Text className="text-red-900 text-4xl font-bold">Handler Route</Text>
                    </Pressable>

                </View>


            </View>
        </View >
    );
}