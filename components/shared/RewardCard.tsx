import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import { RewardCardProps } from '@/types/type';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
} from 'react-native-reanimated';

export default function RewardCard({
    title,
    rewardName,
    reward_type,
    unlock_points,
    days_left,
    isLocked,
}: RewardCardProps) {
    // Shared scale value for bounce effect (one-time animation)
    const scale = useSharedValue(reward_type === 'promo' ? 0.4 : 0.7);
    const glowOpacity = useSharedValue(0.3);

    // Glow color based on reward type
    const glowColor = reward_type === 'promo' ? 'rgba(34, 197, 94, 1)' : 'rgba(79, 70, 229, 1)';

    useEffect(() => {
        // One-time bounce effect on mount
        if (reward_type === 'promo') {
            scale.value = withSpring(1, { damping: 6, stiffness: 100 });
        } else {
            scale.value = withDelay(150, withSpring(1, { damping: 6, stiffness: 100 }));
        }

        // Stronger continuous glow effect (more visible)
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 700 }),  // Brightest glow
                withTiming(0.3, { duration: 700 }) // Dims down
            ),
            -1, // Infinite repeat
            true // Auto-reverse each cycle
        );
    }, [scale, glowOpacity]);

    // Animated glow effect (pulsing glow)
    const glowAnimatedStyle = useAnimatedStyle(() => ({
        shadowOpacity: glowOpacity.value,
        shadowRadius: 35 + glowOpacity.value * 10, // More visible glow variation
    }));

    // Animated bounce effect (happens once)
    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            className="h-full w-[240px] max-h-[275px] flex px-3 py-4 gap-y-3 rounded-3xl items-center justify-between"
            style={[
                cardAnimatedStyle,
                glowAnimatedStyle,
                {
                    shadowColor: glowColor, // Dynamic glow color
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 1, // Maximum initial glow intensity
                    elevation: 20, // Android glow effect boost
                    backgroundColor: 'white', // Ensures glow is visible
                    filter: isLocked ? "brightness(70%) blur(0.8px)" : "none",
                },
            ]}
        >
            {/* Header Title Box */}
            <View
                className={`w-full h-[30%] flex items-center justify-center rounded-xl relative overflow-hidden ${reward_type === 'promo' ? 'bg-green-600' : 'bg-indigo-700'
                    }`}
            >
                {/* Left-side Confetti */}
                <Text className="text-4xl absolute left-4 pr-4">🎊</Text>

                {/* Right-side Confetti */}
                <Text className="text-4xl absolute right-4 pl-4">🎊</Text>

                {/* Title Text */}
                <Text className="text-white font-bold text-3xl relative z-10">
                    {title}
                </Text>
            </View>

            <View
                className={`w-full h-[68%] flex items-center justify-between rounded-3xl border-4 ${reward_type === 'promo' ? 'border-green-200' : 'border-indigo-200'
                    }`}
            >
                {/* Reward Text */}
                <Text className="text-center text-2xl font-semibold my-2 text-gray-900 pt-4 px-2">
                    {rewardName}
                </Text>

                {/* Display Promo Details OR Unlock Points */}
                {reward_type === 'promo' ? (
                    <Text className="text-green-700 font-bold text-2xl pb-3">
                        Promo <Text className="text-red-600 text-xl">({days_left} days left)</Text>
                    </Text>
                ) : (
                    <View className="flex-row items-center gap-x-1 pb-2">
                        {/* Show "Unlocked at" only if locked */}
                        {isLocked && (
                            <Text className="text-gray-600 font-semibold text-xl">
                                Unlocked at
                            </Text>
                        )}
                        <View className="flex flex-row items-center justify-center gap-x-1">
                            <Image
                                source={require('../../assets/images/screen/reward/coin.png')}
                                className="w-10 h-10"
                            />
                            <Text className="text-3xl font-bold text-gray-900">
                                {unlock_points}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}