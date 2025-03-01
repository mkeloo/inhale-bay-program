import { useRouter, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function RefreshPageRoute() {
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        // Automatically trigger the onPress function after 100ms
        const timeoutId = setTimeout(() => {
            handlePress();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, []);

    const handlePress = () => {
        if (navigation.canGoBack()) {
            // navigation.goBack(); // Go back to the previous screen
            router.replace('/(root)/(admin)/admin');
        } else {
            router.replace("/"); // If there's no previous screen, send to home
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Pressable
                onPress={handlePress}
                className="flex-row items-center justify-center bg-purple-200 px-6 py-4 rounded-lg"
            >
                <ActivityIndicator size={'large'} color="purple" />
                <Text className="text-2xl text-purple-900 font-bold ml-4">Refreshing...</Text>
            </Pressable>
        </View>
    );
}