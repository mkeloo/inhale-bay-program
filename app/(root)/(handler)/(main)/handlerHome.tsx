import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const userProfile = {
    id: 1,
    name: 'John Doe',
    phone_number: '1234567890',
    current_points: 130,
    last_visit: '02/17/2025',
    member_since: '01/01/2020',
    membership_level: 'New',
    avatar_name: 'Bear',
    lifetime_points: 1000,
};


export default function HandlerHomeScreen() {
    return (
        <View className='flex-1 items-center justify-center'>
            <View className='flex items-center justify-center gap-y-4'>
                <Text className='text-4xl my-4'>Handler Home Screen</Text>
                <Pressable onPress={() => router.push('/welcome')} className='bg-yellow-500 p-4 rounded-xl'>
                    <Text className='text-white text-2xl'>Home Route</Text>
                </Pressable>

                {/* Handler Confirm Screen */}
                <Pressable onPress={() => router.push('/(root)/(handler)/handlerConfirm')} className='bg-cyan-500 p-4 rounded-xl'>
                    <Text className='text-white text-2xl'>Handler Screen</Text>
                </Pressable>


                {/* Navigate to User Profile with props */}
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/(root)/(handler)/(user)/userProfile",
                            params: {
                                name: userProfile.name,
                                current_points: userProfile.current_points.toString(),
                                last_visit: userProfile.last_visit,
                                membership_level: userProfile.membership_level,
                                avatar_name: userProfile.avatar_name,
                            },
                        })
                    }
                    className="bg-purple-500 p-4 rounded-xl"
                >
                    <Text className="text-white text-2xl">User Profile Screen</Text>
                </Pressable>
            </View>
        </View >
    )
}