import { router } from "expo-router";
import { MoveLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import * as Haptics from 'expo-haptics';
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict (true) mode by default
});


export default function BackButton() {
    return (
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

    )
}