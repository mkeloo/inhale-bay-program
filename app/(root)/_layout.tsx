import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="(admin)"
                options={{
                    headerShown: false,
                    animation: "fade",
                }}
            />
            <Stack.Screen name="(client)" options={{ headerShown: false }} />
            <Stack.Screen name="(handler)" options={{ headerShown: false }} />
        </Stack>
    );
}