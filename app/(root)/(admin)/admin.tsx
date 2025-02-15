import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function AdminScreen() {
    return (
        <View className='flex-1 items-center justify-center'>
            <Text className='text-4xl my-4'>Admin Screen</Text>
            <Pressable onPress={() => router.push('/welcome')} className='bg-green-500 p-4 rounded-xl'>
                <Text className='text-white text-2xl'>Home Route</Text>
            </Pressable>
        </View>
    )
}