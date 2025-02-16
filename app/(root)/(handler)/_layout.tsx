import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="handler" options={{ headerShown: false }} />
            <Stack.Screen name="handlerConfirm" options={{ headerShown: false }} />
        </Stack>
    );
}