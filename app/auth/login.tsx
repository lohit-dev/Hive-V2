import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Link, router } from "expo-router";
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

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useThemeColors } from "@/constants/useThemeColors";
import { useAuthStore } from "@/stores/authStore";

export default function LoginScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)");
    } finally {
      setSubmitting(false);
    }
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
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your job search.
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

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={colors.textSecondary}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable onPress={() => setShowPassword((v) => !v)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        <Link href={"/auth/forgot-password" as never} asChild>
          <Pressable style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </Link>

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            (pressed || submitting) && { opacity: 0.85 },
          ]}
          disabled={submitting}
          onPress={onSubmit}
        >
          <Text style={styles.primaryBtnText}>
            {submitting ? "Signing in…" : "Sign in"}
          </Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn}>
            <Ionicons name="logo-apple" size={20} color={colors.text} />
            <Text style={styles.socialText}>Apple</Text>
          </Pressable>
          <Pressable style={styles.socialBtn}>
            <Ionicons name="logo-google" size={20} color={colors.text} />
            <Text style={styles.socialText}>Google</Text>
          </Pressable>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to Hive?</Text>
          <Link href={"/auth/register" as never} asChild>
            <Pressable>
              <Text style={styles.footerLink}>Create an account</Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAwareScrollViewCompat>
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
    content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
    title: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 6,
      marginBottom: 28,
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
    forgotRow: { alignSelf: "flex-end", paddingVertical: 4, marginBottom: 8 },
    forgotText: {
      color: colors.tint,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
    primaryBtn: {
      backgroundColor: colors.tint,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 12,
    },
    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginVertical: 24,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
    },
    socialRow: { flexDirection: "row", gap: 12 },
    socialBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    socialText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.text,
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      marginTop: 28,
    },
    footerText: { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
    footerLink: { color: colors.tint, fontFamily: "Inter_600SemiBold" },
  });
}
