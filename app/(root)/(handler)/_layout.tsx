import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="(user)" options={{ headerShown: false }} />
            <Stack.Screen name="(misc)" options={{ headerShown: false }} />
            <Stack.Screen name="handlerConfirm" options={{ headerShown: false }} />
        </Stack>
    );
}