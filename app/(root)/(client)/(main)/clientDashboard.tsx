import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import BackButton from '@/components/shared/BackButton'

export default function ClientDashboardScreen() {
    return (
        <View className='flex-1 items-center justify-center relative'>
            {/* Back Button */}
            <BackButton />


            <Text className='text-4xl my-4'>Client Dashboard Screen</Text>
            <Pressable onPress={() => router.push('/welcome')} className='bg-green-500 p-4 rounded-xl'>
                <Text className='text-white text-2xl'>Home Route</Text>
            </Pressable>
        </View>
    )
}