import { Redirect, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { useAuthStore } from "@/stores/authStore";

export default function Index() {
  const router = useRouter();
  // const segments = useSegments();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasOnboarded = useAuthStore((state) => state.hasOnboarded);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    // Redirect based on auth state
    if (!isAuthenticated) {
      router.replace("/auth/welcome");
    } else if (!hasOnboarded) {
      router.replace("/onboarding");
    } else {
      router.replace("/(tabs)");
    }
  }, [hydrated, isAuthenticated, hasOnboarded]);

  // Show nothing while determining route
  return <View style={{ flex: 1 }} />;
}
