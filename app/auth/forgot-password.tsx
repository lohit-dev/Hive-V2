import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const onSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Enter the email tied to your account.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSent(true);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 8,
          },
        ]}
      >
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <Ionicons name="key-outline" size={28} color={colors.tint} />
        </View>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>
          Enter the email connected to your Hive account and we&apos;ll send you
          a secure link to set a new password.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={colors.textSecondary}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
        </View>

        {sent ? (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={20} color={colors.tint} />
            <Text style={styles.successText}>
              If an account exists for {email.trim()}, you&apos;ll receive a
              reset link in a few minutes.
            </Text>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.85 },
          ]}
          onPress={onSubmit}
        >
          <Text style={styles.primaryBtnText}>
            {sent ? "Resend reset link" : "Send reset link"}
          </Text>
        </Pressable>

        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={14} color={colors.textSecondary} />
          <Text style={styles.backText}>Back to sign in</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 16, paddingBottom: 8 },
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: colors.categoryBg,
    },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
    iconBadge: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      letterSpacing: -0.4,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 6,
      marginBottom: 24,
    },
    field: { marginBottom: 16 },
    label: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
      marginBottom: 6,
      marginLeft: 2,
    },
    inputWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === "ios" ? 14 : 8,
    },
    input: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.text,
    },
    successCard: {
      flexDirection: "row",
      gap: 10,
      backgroundColor: colors.tintLight,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12,
    },
    successText: {
      flex: 1,
      color: colors.text,
      fontSize: 13,
      lineHeight: 19,
      fontFamily: "Inter_500Medium",
    },
    primaryBtn: {
      backgroundColor: colors.tint,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 8,
    },
    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    backRow: {
      flexDirection: "row",
      gap: 6,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 18,
    },
    backText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
  });
}
