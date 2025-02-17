import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function UserProfileScreen() {
    return (
        <View className='flex-1 items-center justify-center bg-slate-900 gap-y-4'>
            <Text className='text-white text-2xl font-bold'>UserProfileScreen</Text>


            {/* Go Back */}
            <Pressable onPress={() => router.back()} className='bg-cyan-500 p-4 rounded-xl'>
                <Text className='text-white text-2xl'>Go Back</Text>
            </Pressable>



        </View>
    )
}