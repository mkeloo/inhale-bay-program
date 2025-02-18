import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
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
import { Check, CheckCheck } from 'lucide-react-native';

export default function ClientAvatarScreen() {
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [showCheck, setShowCheck] = useState(false);
    const [timer, setTimer] = useState(10);
    const [submitted, setSubmitted] = useState(false);

    const router = useRouter();
    const scale = useSharedValue(1);
    const checkScale = useSharedValue(0);

    const handleAvatarSelect = (id: number) => {
        setSelectedAvatar(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Trigger a brief scale-up animation on the selected avatar
        scale.value = withSpring(1.1, { damping: 5, stiffness: 100 });
        setTimeout(() => {
            scale.value = withSpring(1);
        }, 200);
    };

    const getAvatarStyle = (thisAvatarId: number) =>
        useAnimatedStyle(() => ({
            transform: [{ scale: thisAvatarId === selectedAvatar ? scale.value : 1 }],
        }));

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

    return (
        <ScrollView contentContainerClassName="relative flex h-full items-center justify-center bg-gray-900 py-10 pb-32">
            <BackButton />

            <View className="flex-row items-center justify-center mb-16 gap-x-4">
                <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Check size={24} color="black" />
                </View>
                <View className="w-12 h-1 bg-white" />

                <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Check size={24} color="black" />
                </View>
                <View className="w-12 h-1 bg-white" />

                <View className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <Text className="text-black text-xl font-bold">3</Text>
                </View>
                <View className="w-12 h-1 bg-white" />

                <View className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
                    <CheckCheck size={24} color="white" />
                </View>
            </View>

            <Text className="text-white text-4xl font-bold mb-4">Select Your Avatar</Text>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!selectedAvatar}
                className={`mb-10 px-6 py-4 rounded-xl flex-row items-center justify-center gap-x-3 w-full max-w-sm ${selectedAvatar ? 'bg-green-600' : 'bg-gray-500 opacity-50'
                    }`}
            >
                <Text className="text-white font-bold text-2xl uppercase text-center">Submit</Text>
                <Text className="text-white text-xl font-bold opacity-70">({timer}s)</Text>
            </TouchableOpacity>

            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 6,
                    width: '95%',
                }}
            >
                {avatarsImages.map((avatar) => {
                    const animatedStyle = getAvatarStyle(avatar.id);
                    return (
                        <TouchableOpacity
                            key={avatar.id}
                            onPress={() => handleAvatarSelect(avatar.id)}
                            className={`p-2 rounded-2xl border-4 ${selectedAvatar === avatar.id
                                    ? 'border-yellow-800 bg-amber-400'
                                    : 'border-gray-900'
                                }`}
                            style={{ width: '11%', aspectRatio: 1, alignItems: 'center' }}
                        >
                            <Animated.View style={animatedStyle}>
                                <Image
                                    source={avatar.image}
                                    className="w-24 h-24 rounded-lg"
                                    resizeMode="contain"
                                />
                            </Animated.View>
                            <Text
                                className={`text-center font-bold mt-2 text-lg ${selectedAvatar === avatar.id ? 'text-black' : 'text-white'
                                    }`}
                            >
                                {avatar.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {showCheck && (
                <View className="absolute top-[50%] left-0 right-0 flex items-center">
                    <Animated.View style={checkOverlayStyle} className="px-7 py-6 rounded-full bg-blue-800/80">
                        <Text className="text-green-400 text-4xl font-bold">✓</Text>
                    </Animated.View>
                </View>
            )}
        </ScrollView>
    );
}