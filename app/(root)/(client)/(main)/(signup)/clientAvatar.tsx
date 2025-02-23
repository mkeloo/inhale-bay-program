import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { avatarsImages } from '@/lib/data';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import BackButton from '@/components/shared/BackButton';
import Stepper from '@/components/client/Stepper';

export default function ClientAvatarScreen() {
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [showCheck, setShowCheck] = useState(false);
    const [timer, setTimer] = useState(15);
    const [submitted, setSubmitted] = useState(false);

    const router = useRouter();
    const scale = useSharedValue(1);
    const checkScale = useSharedValue(0);

    const handleAvatarSelect = (id: number) => {
        setSelectedAvatar(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Trigger a brief scale-up animation on the selected avatar
        scale.value = withSpring(1.35, { damping: 5, stiffness: 100 });
        setTimeout(() => {
            scale.value = withSpring(1);
        }, 200);
    };



    const checkOverlayStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
        opacity: checkScale.value,
    }));

    // Timer countdown effect (runs only once)
    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 0) {
                    clearInterval(countdown);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(countdown);
    }, []);

    // Watch for timer reaching 0 to trigger submit
    useEffect(() => {
        if (timer === 0 && !submitted) {
            // If no avatar was selected, set fallback avatar (first in the list)
            if (!selectedAvatar) {
                setSelectedAvatar(avatarsImages[0].id);
            }
            setTimeout(handleSubmit, 300);
        }
    }, [timer, submitted, selectedAvatar]);

    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);

        // Use the already-selected avatar, or fallback if still null
        const finalAvatar = selectedAvatar ?? avatarsImages[0].id;
        setSelectedAvatar(finalAvatar);
        setShowCheck(true);
        checkScale.value = withSpring(1, { damping: 6, stiffness: 120 });

        setTimeout(() => {
            router.push('/(root)/(client)/(main)/clientDashboard');
        }, 300);

        setTimeout(() => {
            checkScale.value = withTiming(0, { duration: 150 });
            setShowCheck(false);
        }, 600);
    };

    // Precompute animation styles at the top of the component
    const animatedStyles = avatarsImages.reduce((acc, avatar) => {
        acc[avatar.id] = useAnimatedStyle(() => ({
            transform: [{ scale: avatar.id === selectedAvatar ? scale.value : 1 }],
        }));
        return acc;
    }, {} as Record<number, any>);

    return (
        <View className="relative flex h-full items-center justify-center bg-gray-900 ">
            <BackButton />

            <View className='w-full h-[30%] flex items-center justify-center  pt-6'>
                {/* Stepper - Static UI */}
                <Stepper type='avatar' />


                <Text className="text-white text-6xl font-bold">Choose Your Avatar</Text>
            </View>



            {/*   Avatar Grid    */}
            <View className="h-[50%] w-full items-center justify-center bg-opacity-50">
                <FlatList
                    data={avatarsImages}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={8} // 8 columns for the grid
                    // contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    contentContainerClassName='flex items-center justify-center gap-y-10 '
                    renderItem={({ item }) => {
                        const animatedStyle = animatedStyles[item.id]; // Use stored animation styles
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleAvatarSelect(item.id)}
                                className={`p-2  mx-1.5 rounded-2xl border-4 ${selectedAvatar === item.id ? 'border-yellow-800 bg-amber-400' : 'border-gray-900'
                                    }`}
                                style={[
                                    {
                                        width: '11%',
                                        alignItems: 'center',
                                        height: '100%',
                                    },
                                    animatedStyle, // Apply scaling effect
                                ]}
                            >
                                <Animated.View style={animatedStyle}>
                                    <Image
                                        source={item.image}
                                        className="w-[100px] h-[100px] rounded-2xl"
                                        resizeMode="contain"
                                    />
                                </Animated.View>
                                <Text
                                    className={`text-center font-bold mt-2 text-lg ${selectedAvatar === item.id ? 'text-black' : 'text-white'
                                        }`}
                                >
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Timer Submit Button */}
            <View className="w-full h-[20%] flex items-center justify-start">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!selectedAvatar}
                    className={` px-6 py-6 rounded-xl flex-row items-center justify-center gap-x-3 w-full max-w-sm ${selectedAvatar ? 'bg-green-600' : 'bg-gray-500 opacity-50'
                        }`}
                >
                    <Text className="text-white font-bold text-3xl uppercase text-center">Submit</Text>
                    <Text className="text-white text-2xl font-bold opacity-70">({timer}s)</Text>
                </TouchableOpacity>
            </View>

            {showCheck && (
                <View className="absolute top-[50%] left-0 right-0 flex items-center">
                    <Animated.View style={checkOverlayStyle} className="px-7 py-6 rounded-full bg-blue-800/80">
                        <Text className="text-green-400 text-4xl font-bold">✓</Text>
                    </Animated.View>
                </View>
            )}
        </View>
    );
}