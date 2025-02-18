import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="(signup)" options={{ headerShown: false }} />
            <Stack.Screen name="clientDashboard" options={{ headerShown: false }} />
            <Stack.Screen name="clientHome" options={{ headerShown: false }} />
        </Stack>
    );
}