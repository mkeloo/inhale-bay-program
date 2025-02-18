import { Stack, usePathname } from "expo-router"; // Import usePathname to detect route
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { BackHandler, ToastAndroid, AppState, AppStateStatus, View, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useKeepAwake } from "expo-keep-awake"; // Prevent screen sleep
import * as ScreenOrientation from "expo-screen-orientation"; // Import Screen Orientation API
import "../global.css";

export default function RootLayout() {
  const pathname = usePathname(); // Get current route path
  useKeepAwake(); // Prevent screen sleep

  // 🔹 Lock screen orientation to LANDSCAPE RIGHT
  const lockScreenOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
  };
  lockScreenOrientation();

  useEffect(() => {
    // Only apply navigation blocking for Android
    if (Platform.OS === "android") {
      // Hide the navigation bar initially
      const hideNavBar = async () => {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("inset-swipe"); // Keeps it hidden until swiped
      };

      hideNavBar(); // Run on app startup

      // Function to re-hide the navigation bar after a short delay
      const rehideNavBar = async () => {
        const delay = pathname === "/admin" ? 2000 : 10; // 2s in /admin, 10ms elsewhere

        setTimeout(async () => {
          await NavigationBar.setVisibilityAsync("hidden");
        }, delay);
      };

      // Detect user interaction with navigation bar and re-hide it
      NavigationBar.addVisibilityListener(({ visibility }) => {
        if (visibility === "visible") {
          rehideNavBar();
        }
      });

      // Prevent users from exiting with the Back button
      const handleBackPress = () => {
        ToastAndroid.show("Screen is locked! Contact admin.", ToastAndroid.SHORT);
        return true; // Block back button
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      // Detect when the app is sent to the background (Home or Overview pressed)
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === "background") {
          ToastAndroid.show("App is locked! Returning...", ToastAndroid.SHORT);
        }
      };

      const appStateListener = AppState.addEventListener("change", handleAppStateChange);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
        appStateListener.remove();
      };
    }
  }, [pathname]); // Re-run effect if route changes

  return (
    <View className="flex-1">
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
    </View>
  );
}