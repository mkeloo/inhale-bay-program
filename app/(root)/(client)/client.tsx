import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'

export default function ClientHomeScreen() {
    return (
        <View className='flex-1 items-center justify-center'>
            <View className='flex items-center justify-center gap-y-4'>
                <Text className='text-4xl my-4'>Client Home Screen</Text>
                <Pressable onPress={() => router.push('/welcome')} className='bg-yellow-500 p-4 rounded-xl'>
                    <Text className='text-white text-2xl'>Home Route</Text>
                </Pressable>

                {/* Client Confirm Screen */}
                <Pressable onPress={() => router.push('/(root)/(client)/clientConfirm')} className='bg-cyan-500 p-4 rounded-xl'>
                    <Text className='text-white text-2xl'>Client Screen</Text>
                </Pressable>
            </View>
        </View >
    )
}