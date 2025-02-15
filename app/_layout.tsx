import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
          animationDuration: 300, // Smooth transition speed
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="(setup)" options={{ headerShown: false }} />
        <Stack.Screen
          name="+not-found"
          options={{
            headerShown: false,
            animation: "slide_from_right", // This screen slides in from right
          }}
        />
      </Stack>
    </>
  );
}