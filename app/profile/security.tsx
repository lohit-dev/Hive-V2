import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";

export default function SecurityScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const onChangePassword = () => {
    if (!current || !next || !confirm) {
      Alert.alert("Missing fields", "Please fill all password fields.");
      return;
    }
    if (next !== confirm) {
      Alert.alert("Passwords don't match", "Confirm your new password.");
      return;
    }
    if (next.length < 8) {
      Alert.alert("Too short", "Use at least 8 characters.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Password updated", "Your password has been changed.");
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const sessions = [
    {
      id: "1",
      device: "iPhone 16 Pro",
      location: "San Francisco, CA",
      current: true,
    },
    {
      id: "2",
      device: "MacBook Pro",
      location: "San Francisco, CA",
      current: false,
    },
    {
      id: "3",
      device: "Chrome on Windows",
      location: "Remote",
      current: false,
    },
  ];

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
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 : Math.max(insets.bottom, 16),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Change password</Text>
        <View style={styles.card}>
          {[
            { label: "Current password", val: current, set: setCurrent },
            { label: "New password", val: next, set: setNext },
            { label: "Confirm new password", val: confirm, set: setConfirm },
          ].map((f, idx) => (
            <View
              key={f.label}
              style={[styles.field, idx < 2 && styles.fieldBorder]}
            >
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <TextInput
                value={f.val}
                onChangeText={f.set}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                style={styles.fieldInput}
                secureTextEntry
              />
            </View>
          ))}
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.85 },
          ]}
          onPress={onChangePassword}
        >
          <Text style={styles.primaryBtnText}>Update password</Text>
        </Pressable>

        <Text style={styles.sectionLabel}>Authentication</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowLeft}>
              <View style={styles.iconWrap}>
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color={colors.tint}
                />
              </View>
              <View>
                <Text style={styles.rowTitle}>Biometric unlock</Text>
                <Text style={styles.rowSub}>Use Face ID or Touch ID</Text>
              </View>
            </View>
            <Switch
              value={biometric}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setBiometric(v);
              }}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconWrap}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color={colors.tint}
                />
              </View>
              <View>
                <Text style={styles.rowTitle}>Two-factor auth</Text>
                <Text style={styles.rowSub}>Adds an extra step at sign-in</Text>
              </View>
            </View>
            <Switch
              value={twoFactor}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTwoFactor(v);
              }}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Active sessions</Text>
        <View style={styles.card}>
          {sessions.map((s, idx) => (
            <View
              key={s.id}
              style={[
                styles.row,
                idx < sessions.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={
                      s.device.toLowerCase().includes("iphone")
                        ? "phone-portrait-outline"
                        : s.device.toLowerCase().includes("mac")
                          ? "laptop-outline"
                          : "desktop-outline"
                    }
                    size={20}
                    color={colors.tint}
                  />
                </View>
                <View>
                  <Text style={styles.rowTitle}>{s.device}</Text>
                  <Text style={styles.rowSub}>
                    {s.location}
                    {s.current ? " · This device" : ""}
                  </Text>
                </View>
              </View>
              {!s.current && (
                <Pressable hitSlop={8}>
                  <Feather name="x" size={18} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingBottom: 12,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: colors.categoryBg,
    },
    headerTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
    },
    content: { padding: 20 },
    sectionLabel: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.textSecondary,
      marginBottom: 10,
      marginLeft: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginBottom: 12,
    },
    field: { padding: 14 },
    fieldBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    fieldLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
      marginBottom: 6,
    },
    fieldInput: {
      fontSize: 15,
      color: colors.text,
      fontFamily: "Inter_500Medium",
      paddingVertical: 4,
    },
    primaryBtn: {
      backgroundColor: colors.tint,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      marginBottom: 24,
    },
    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    rowTitle: {
      fontSize: 15,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    rowSub: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
  });
}
