import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { screenCodes } from '@/lib/data';
import { BadgeCheck, Delete } from 'lucide-react-native';

export default function ClientConfirmScreen() {
    const [inputCode, setInputCode] = useState<string>(''); // Store entered code
    const [statusMessage, setStatusMessage] = useState<string>(''); // Status message for error/success
    const [isError, setIsError] = useState<boolean>(false); // Track error state
    const router = useRouter();

    // Expected client passcode from `screenCodes`
    const clientPasscode = screenCodes.find((screen) => screen.name === 'client')?.code.toString();

    // Handle number input
    const handlePress = (num: string) => {
        if (inputCode.length < 4) {
            setInputCode((prev) => prev + num);
        }
    };

    // Handle delete button
    const handleDelete = () => {
        setInputCode((prev) => prev.slice(0, -1)); // Remove last digit
    };

    // Handle enter button
    const handleEnter = () => {
        if (inputCode === clientPasscode) {
            setStatusMessage('Access Granted');
            setIsError(false);

            setTimeout(() => {
                router.push('/client'); // Navigate to client screen after a short delay
            }, 1000);
        } else {
            setStatusMessage('Incorrect Passcode');
            setIsError(true);
            setInputCode(''); // Reset input if incorrect

            // Clear error message after 2 seconds
            setTimeout(() => {
                setStatusMessage('');
                setIsError(false);
            }, 2000);
        }
    };

    return (
        <View className="flex-1 flex-row p-5 bg-gray-900">
            {/* Left Side: Passcode Input */}
            <View className="flex-1 justify-start items-center py-4">

                {/* Logo */}
                <View className='flex items-center justify-center mb-10 rounded-2xl'>
                    <Image source={require('../../../assets/images/screen/logo/ib-logo-2.png')} className="w-40 h-40 rounded-3xl" resizeMode='contain' />
                </View>

                {/* Passcode Dots */}
                <View className="flex items-center justify-center gap-y-4">
                    <Text className='text-white text-3xl font-bold'>Client Passcode</Text>
                    <View className='flex-row space-x-4'>
                        {Array(4)
                            .fill('')
                            .map((_, i) => (
                                <TouchableOpacity
                                    key={i}
                                    activeOpacity={1} // Prevents interaction
                                    className="w-14 h-14 mx-2 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-800"
                                >
                                    <Text className="text-4xl text-white">{inputCode[i] ? '•' : ''}</Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>

                {/* Error/Success Message */}
                {statusMessage && (
                    <Text className={`mt-6 p-4 text-xl font-semibold rounded-lg  ${isError ? 'bg-red-300 text-red-700' : 'bg-green-300 text-green-700'}`}>
                        {statusMessage}
                    </Text>
                )}
            </View>

            {/* Right Side: Keypad */}
            <View className="flex-1 justify-center items-center">
                <View className="flex flex-row flex-wrap justify-center w-[240px] gap-4">
                    {/* First Row */}
                    {[1, 2, 3].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePress(num.toString())}
                            className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center"
                        >
                            <Text className="text-3xl font-bold text-white">{num}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Second Row */}
                    {[4, 5, 6].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePress(num.toString())}
                            className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center"
                        >
                            <Text className="text-3xl font-bold text-white">{num}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Third Row */}
                    {[7, 8, 9].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => handlePress(num.toString())}
                            className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center"
                        >
                            <Text className="text-3xl font-bold text-white">{num}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Fourth Row: Delete, Zero, Enter */}
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center"
                    >
                        <Delete size={32} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handlePress('0')}
                        className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center"
                    >
                        <Text className="text-3xl font-bold text-white">0</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleEnter}
                        className="w-20 h-20 bg-green-600 rounded-xl flex items-center justify-center"
                    >
                        <BadgeCheck size={32} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
