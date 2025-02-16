import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function SetupWelcomeScreen() {
    return (
        <View className='flex-1 items-center justify-center'>
            <Text className='text-4xl my-4'>Welcome Screen!</Text>
            <View className='flex items-center justify-center gap-y-4'>
                <Pressable onPress={() => router.push('/(root)/(admin)/admin')} className='bg-blue-500 p-4 rounded-xl'>
                    <Text className='text-white text-2xl'>Admin Route</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/(root)/(client)/clientConfirm')} className='bg-yellow-500 p-4 rounded-xl'>
                    <Text className='text-white text-2xl'>Client Route</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/(root)/(handler)/handlerConfirm')} className='bg-red-500 p-4 rounded-xl'>
                    <Text className='text-white text-2xl'>Handler Route</Text>
                </Pressable>
            </View>
        </View>
    )
}