// template
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ThemeProvider } from "contexts/ThemeContext";
import { queryClient } from "lib/query-client";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="job/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="search-results" options={{ headerShown: false }} />
      <Stack.Screen name="categories/index" options={{ headerShown: false }} />
      <Stack.Screen name="categories/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
      <Stack.Screen name="profile/help" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/applications"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="profile/resume" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/notifications"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
