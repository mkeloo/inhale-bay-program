import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { screenCodes } from '@/lib/data';
import { BadgeCheck, Delete, MoveLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict (true) mode by default
});


// Accepts either "client" or "handler"
interface ConfirmScreenWrapperProps {
    screenType: 'client' | 'handler';
}

export default function ConfirmScreenWrapper({ screenType }: ConfirmScreenWrapperProps) {
    const [inputCode, setInputCode] = useState<string>(''); // Store entered code
    const [statusMessage, setStatusMessage] = useState<string>(''); // Status message for error/success
    const [isError, setIsError] = useState<boolean>(false); // Track error state
    const router = useRouter();

    // Get expected passcode based on `screenType`
    const passcode = screenCodes.find((screen) => screen.name === screenType)?.code.toString();


    const translateY = useSharedValue(statusMessage ? 50 : 0); // Move up if message exists
    const opacity = useSharedValue(statusMessage ? 0 : 1); // Keep default visible

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: statusMessage ? translateY.value : 0 }], // Move only when needed
        opacity: statusMessage ? opacity.value : 1, // Keep default message visible
    }));


    const showStatusMessage = (message: string, isError: boolean) => {
        setStatusMessage(message);
        setIsError(isError);

        // Start animation
        translateY.value = withSpring(0); // Slide in
        opacity.value = withSpring(1); // Fade in

        setTimeout(() => {
            translateY.value = withSpring(50); // Slide out
            opacity.value = withSpring(0); // Fade out
            setTimeout(() => {
                setStatusMessage('');
                setIsError(false);
            }, 500);
        }, 2000);
    };

    // Handle number input
    const handlePress = (num: string) => {
        if (inputCode.length < 4) {
            setInputCode((prev) => prev + num);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Haptic feedback
        }
    };

    // Handle delete button
    const handleDelete = () => {
        setInputCode((prev) => prev.slice(0, -1)); // Remove last digit
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Haptic feedback
    };

    // Handle enter button
    const handleEnter = () => {
        if (inputCode === passcode) {
            showStatusMessage('Access Granted', false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Haptic success feedback

            setTimeout(() => {
                if (screenType === 'client') {
                    router.push('/(root)/(client)/(main)/clientPhone');  // Navigate to client home
                } else if (screenType === 'handler') {
                    router.push('/(root)/(handler)/(main)/handlerDashboard');  // Navigate to handler dashboard
                }
            }, 2000);
        } else {
            showStatusMessage('Incorrect Passcode', true);
            setInputCode(''); // Reset input if incorrect
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); // Haptic error feedback
        }
    };


    return (
        <View className="flex-1 flex-row p-5 bg-gray-900 relative">

            {/* Back Button */}
            <View className='absolute top-0 left-0 right-0 bottom-0' >
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Haptic feedback
                        router.back();
                    }}
                    className='absolute top-10 left-10 px-3 py-2 bg-yellow-500 rounded-lg active:scale-90 transition-transform duration-150'>
                    <MoveLeft size={32} color="white" />
                </TouchableOpacity>
            </View>

            {/* Left Side: Passcode Input */}
            <View className="flex-1 justify-center items-center py-4">
                {/* Logo */}
                <View className="flex items-center justify-center my-4 rounded-2xl">
                    <Image
                        source={require('../../assets/images/screen/logo/ib-logo-2.png')}
                        className="w-40 h-40 rounded-3xl"
                        resizeMode="contain"
                    />
                </View>

                {/* Passcode Dots */}
                <View className="flex items-center justify-center gap-y-4">
                    <Text className="text-white text-3xl font-bold">
                        {screenType.charAt(0).toUpperCase() + screenType.slice(1)} Passcode
                    </Text>
                    <View className="flex-row space-x-4">
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
                <Animated.View style={[animatedStyle]} className="mt-4 p-4 rounded-lg flex flex-row items-center space-x-3">
                    {statusMessage ? (
                        isError ? (
                            <Text className="text-xl font-semibold bg-red-300 text-red-700 p-4 rounded-lg">
                                {statusMessage}
                            </Text>
                        ) : (
                            <View className="flex flex-row items-center gap-x-3 bg-green-300 p-4 rounded-lg">
                                <Text className="text-xl font-semibold text-green-700">
                                    {statusMessage}
                                </Text>
                                {/* Activity Indicator (Only for Success Message) */}
                                <ActivityIndicator size="small" color="#047857" />
                            </View>
                        )
                    ) : (
                        // Default Yellow Message (Now Always Visible)
                        <Text className="text-xl font-semibold bg-yellow-300 text-yellow-700 p-4 rounded-lg">
                            Awaiting Input...
                        </Text>
                    )}
                </Animated.View>
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
        </View >
    );
}