import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="admin" options={{ headerShown: false }} />
        </Stack>
    );
}