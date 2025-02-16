import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { avatarsImages } from '@/lib/data';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

export default function ClientAvatarScreen() {
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [showCheck, setShowCheck] = useState(false); // Controls whether to show the check overlay

    const router = useRouter();
    const scale = useSharedValue(1);

    // Scale for the check overlay
    const checkScale = useSharedValue(0);

    const handleAvatarSelect = (id: number) => {
        setSelectedAvatar(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Trigger a brief scale-up animation on the selected avatar
        scale.value = withSpring(1.1, { damping: 5, stiffness: 100 });
        setTimeout(() => {
            scale.value = withSpring(1);
        }, 200);

        // Show the check overlay
        setShowCheck(true);
        checkScale.value = withSpring(1, { damping: 6, stiffness: 120 });

        // After a short delay, hide the check and navigate
        setTimeout(() => {
            checkScale.value = withTiming(0, { duration: 150 });
            setShowCheck(false);

            // Navigate to the next screen
            router.push('/(root)/(client)/(main)/clientDashboard');
        }, 1000);
    };

    // Avatar animation style
    const getAvatarStyle = (thisAvatarId: number) =>
        useAnimatedStyle(() => ({
            transform: [{ scale: thisAvatarId === selectedAvatar ? scale.value : 1 }],
        }));

    // Check overlay animation style
    const checkOverlayStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
        opacity: checkScale.value, // fades in/out as it scales
    }));

    return (
        <ScrollView contentContainerClassName="relative flex items-center justify-center bg-gray-900 py-10 pb-32">
            <Text className="text-white text-3xl font-bold mb-6">Select Your Avatar</Text>

            {/* Avatar Grid */}
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 4,
                    width: '50%',
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
                            style={{ width: '22%', aspectRatio: 1, alignItems: 'center' }} // 4 items per row
                        >
                            <Animated.View style={animatedStyle}>
                                <Image
                                    source={avatar.image}
                                    className="w-20 h-20 rounded-lg"
                                    resizeMode="contain"
                                />
                            </Animated.View>
                            <Text
                                className={`text-center font-bold mt-2 ${selectedAvatar === avatar.id ? 'text-black' : 'text-white'
                                    }`}
                            >
                                {avatar.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Check Overlay (shown briefly after selection) */}
            {showCheck && (
                <View className="absolute top-[50%] left-0 right-0 flex items-center">
                    <Animated.View
                        style={checkOverlayStyle}
                        className="px-7 py-6 rounded-full bg-blue-800/80"
                    >
                        <Text className="text-green-400 text-4xl font-bold">✓</Text>
                    </Animated.View>
                </View>
            )}
        </ScrollView>
    );
}