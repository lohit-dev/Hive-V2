import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";
import { useAuthStore } from "@/stores/authStore";

export default function WelcomeScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const continueAsGuest = useAuthStore((state) => state.continueAsGuest);
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const handleGuestContinue = async () => {
    await continueAsGuest();
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.tintLight, colors.background]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === "web" ? webTopInset : insets.top,
          paddingBottom: Platform.OS === "web" ? webBottomInset : insets.bottom,
          paddingHorizontal: 24,
          justifyContent: "space-between",
        }}
      >
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Welcome to Hive</Text>
          <Text style={styles.subtitle}>
            Find roles that match your craft. Apply faster, hear back sooner,
            and keep every opportunity in one place.
          </Text>
        </View>

        <View style={styles.illustration}>
          <View style={[styles.bubble, styles.bubbleLg]}>
            <Ionicons name="trending-up" size={28} color={colors.tint} />
          </View>
          <View style={[styles.bubble, styles.bubbleSm]}>
            <Ionicons name="rocket" size={20} color={colors.tint} />
          </View>
          <View style={[styles.bubble, styles.bubbleMd]}>
            <Ionicons name="sparkles" size={22} color={colors.tint} />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => router.push("/auth/register" as never)}
          >
            <Text style={styles.primaryBtnText}>Create account</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push("/auth/login" as never)}
          >
            <Text style={styles.secondaryBtnText}>
              I already have an account
            </Text>
          </Pressable>
          <Pressable style={styles.skipRow} onPress={handleGuestContinue}>
            <Text style={styles.skipText}>Continue as guest</Text>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    heroSection: { gap: 12, marginTop: 12 },
    logoBadge: {
      width: 80,
      height: 80,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8,
      overflow: "hidden",
    },
    logoImage: {
      width: 72,
      height: 72,
    },
    title: {
      fontSize: 36,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      letterSpacing: -1,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      marginTop: 4,
    },
    illustration: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    bubble: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    bubbleLg: {
      width: 96,
      height: 96,
      borderRadius: 28,
    },
    bubbleMd: {
      position: "absolute",
      width: 72,
      height: 72,
      borderRadius: 22,
      top: "30%",
      right: "18%",
    },
    bubbleSm: {
      position: "absolute",
      width: 56,
      height: 56,
      borderRadius: 18,
      bottom: "28%",
      left: "20%",
    },
    actions: { gap: 12 },
    primaryBtn: {
      backgroundColor: colors.tint,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    secondaryBtn: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryBtnText: {
      color: colors.text,
      fontSize: 15,
      fontFamily: "Inter_500Medium",
    },
    skipRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 8,
    },
    skipText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
  });
}
