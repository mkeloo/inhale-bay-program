import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="client" options={{ headerShown: false }} />
        </Stack>
    );
}