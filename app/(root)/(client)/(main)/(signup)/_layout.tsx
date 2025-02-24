import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="clientPhone" options={{ headerShown: false }} />
            <Stack.Screen name="clientName" options={{ headerShown: false }} />
            <Stack.Screen name="clientAvatar" options={{ headerShown: false }} />
            <Stack.Screen name="clientDummyAvatar" options={{ headerShown: false }} />
        </Stack>
    );
}