import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="clientConfirm" options={{ headerShown: false }} />
        </Stack>
    );
}