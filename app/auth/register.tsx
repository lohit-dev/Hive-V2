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

export default function RegisterScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const signUp = useAuthStore((state) => state.signUp);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const onSubmit = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Missing details", "Please fill all fields to continue.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Password too short", "Use at least 8 characters.");
      return;
    }
    if (!agree) {
      Alert.alert(
        "Accept the terms",
        "You'll need to agree to our terms to continue.",
      );
      return;
    }
    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await signUp(name.trim(), email.trim(), password);
      router.replace("/onboarding" as never);
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
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Start tracking jobs, applications and saved roles in one place.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Full name</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="person-outline"
              size={18}
              color={colors.textSecondary}
            />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>
        </View>

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
              autoComplete="password-new"
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

        <Pressable style={styles.termsRow} onPress={() => setAgree((v) => !v)}>
          <View
            style={[
              styles.checkbox,
              agree && {
                backgroundColor: colors.tint,
                borderColor: colors.tint,
              },
            ]}
          >
            {agree && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
          </View>
          <Text style={styles.termsText}>
            I agree to Hive&apos;s <Text style={styles.termsLink}>Terms</Text>{" "}
            and <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            (pressed || submitting) && { opacity: 0.85 },
          ]}
          disabled={submitting}
          onPress={onSubmit}
        >
          <Text style={styles.primaryBtnText}>
            {submitting ? "Creating account…" : "Create account"}
          </Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href={"/auth/login" as never} asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign in</Text>
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
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
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
    termsRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginTop: 6,
      marginBottom: 18,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 1,
    },
    termsText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
    },
    termsLink: { color: colors.tint, fontFamily: "Inter_500Medium" },
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
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
      marginTop: 24,
    },
    footerText: { color: colors.textSecondary, fontFamily: "Inter_400Regular" },
    footerLink: { color: colors.tint, fontFamily: "Inter_600SemiBold" },
  });
}
