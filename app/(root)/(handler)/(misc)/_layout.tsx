import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="search" options={{ headerShown: false }} />
        </Stack>
    );
}