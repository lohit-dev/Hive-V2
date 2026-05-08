import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";
import { useAuthStore } from "@/stores/authStore";
import { useResolvedTheme } from "@/stores/themeStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type Row =
  | {
      kind: "link";
      label: string;
      icon: React.ComponentProps<typeof Ionicons>["name"];
      sub?: string;
      value?: string;
      onPress: () => void;
    }
  | {
      kind: "toggle";
      label: string;
      icon: React.ComponentProps<typeof Ionicons>["name"];
      sub?: string;
      value: boolean;
      onChange: (v: boolean) => void;
    };

export default function SettingsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { preference } = useResolvedTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const themeLabel =
    preference === "system"
      ? "System"
      : preference === "dark"
        ? "Dark"
        : "Light";

  const accountRows: Row[] = [
    {
      kind: "link",
      label: "Edit profile",
      icon: "person-outline",
      sub: "Name, photo, contact details",
      onPress: () => router.push("/profile/edit" as never),
    },
    {
      kind: "link",
      label: "Resume",
      icon: "document-text-outline",
      sub: "Upload and manage your resume",
      onPress: () => router.push("/profile/resume"),
    },
    {
      kind: "link",
      label: "Applications",
      icon: "briefcase-outline",
      sub: "Track your applied jobs",
      onPress: () => router.push("/profile/applications"),
    },
    {
      kind: "link",
      label: "Job preferences",
      icon: "options-outline",
      sub: "Roles, type, salary",
      onPress: () => router.push("/profile/preferences" as never),
    },
  ];

  const securityRows: Row[] = [
    {
      kind: "link",
      label: "Security",
      icon: "lock-closed-outline",
      sub: "Password, 2FA, sessions",
      onPress: () => router.push("/profile/security"),
    },
    {
      kind: "link",
      label: "Privacy",
      icon: "shield-checkmark-outline",
      sub: "Visibility, data, sharing",
      onPress: () => router.push("/profile/privacy"),
    },
  ];

  const notifRows: Row[] = [
    {
      kind: "toggle",
      label: "Push notifications",
      icon: "notifications-outline",
      sub: "On this device",
      value: pushEnabled,
      onChange: setPushEnabled,
    },
    {
      kind: "toggle",
      label: "Email notifications",
      icon: "mail-outline",
      sub: "Updates to your inbox",
      value: emailEnabled,
      onChange: setEmailEnabled,
    },
    {
      kind: "toggle",
      label: "Job alerts",
      icon: "flash-outline",
      sub: "New roles matching you",
      value: jobAlerts,
      onChange: setJobAlerts,
    },
    {
      kind: "toggle",
      label: "Weekly digest",
      icon: "calendar-outline",
      sub: "Summary every Monday",
      value: weeklyDigest,
      onChange: setWeeklyDigest,
    },
    {
      kind: "link",
      label: "Notification center",
      icon: "list-outline",
      sub: "Recent updates",
      onPress: () => router.push("/profile/notifications"),
    },
  ];

  const appRows: Row[] = [
    {
      kind: "link",
      label: "Appearance",
      icon: "color-palette-outline",
      value: themeLabel,
      onPress: () => router.push("/profile/appearance"),
    },
    {
      kind: "link",
      label: "Language",
      icon: "language-outline",
      value: "English",
      onPress: () => router.push("/profile/language"),
    },
  ];

  const aboutRows: Row[] = [
    {
      kind: "link",
      label: "Help & support",
      icon: "help-circle-outline",
      onPress: () => router.push("/profile/help"),
    },
    {
      kind: "link",
      label: "About Hive",
      icon: "information-circle-outline",
      onPress: () => router.push("/profile/about"),
    },
  ];

  const renderRow = (row: Row, isLast: boolean) => {
    const RowContent = (
      <View style={[styles.row, !isLast && styles.rowBorder]}>
        <View style={styles.rowLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name={row.icon} size={20} color={colors.tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{row.label}</Text>
            {row.sub ? <Text style={styles.rowSub}>{row.sub}</Text> : null}
          </View>
        </View>
        {row.kind === "toggle" ? (
          <Switch
            value={row.value}
            onValueChange={(v) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              row.onChange(v);
            }}
            trackColor={{ false: colors.border, true: colors.tint }}
            thumbColor="#FFFFFF"
          />
        ) : (
          <View style={styles.rowRight}>
            {row.value ? (
              <Text style={styles.rowValue}>{row.value}</Text>
            ) : null}
            <Feather
              name="chevron-right"
              size={18}
              color={colors.textSecondary}
            />
          </View>
        )}
      </View>
    );

    if (row.kind === "link") {
      return (
        <Pressable
          key={row.label}
          style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          onPress={row.onPress}
        >
          {RowContent}
        </Pressable>
      );
    }
    return <View key={row.label}>{RowContent}</View>;
  };

  const renderSection = (title: string, rows: Row[]) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.card}>
        {rows.map((r, idx) => renderRow(r, idx === rows.length - 1))}
      </View>
    </View>
  );

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            {
              paddingTop:
                (Platform.OS === "web" ? webTopInset : insets.top) + 8,
            },
          ]}
        >
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom:
                Platform.OS === "web" ? 60 : Math.max(insets.bottom, 24),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={({ pressed }) => [
              styles.profileCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.push("/profile/edit" as never)}
          >
            {user?.avatarUri ? (
              <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(user?.name ?? "U").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName} numberOfLines={1}>
                {user?.name ?? "Sign in"}
              </Text>
              <Text style={styles.profileMeta} numberOfLines={1}>
                {user?.email ?? "Tap to sign in"}
              </Text>
              {user?.title ? (
                <Text style={styles.profileTitle} numberOfLines={1}>
                  {user.title}
                </Text>
              ) : null}
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>

          {renderSection("Account", accountRows)}
          {renderSection("Privacy & security", securityRows)}
          {renderSection("Notifications", notifRows)}
          {renderSection("App", appRows)}
          {renderSection("Support", aboutRows)}

          <Pressable
            style={({ pressed }) => [
              styles.signOutBtn,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() =>
              Alert.alert(
                "Sign out?",
                "You'll need to sign in again next time.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Sign out",
                    style: "destructive",
                    onPress: async () => {
                      await signOut();
                      router.replace("/auth/welcome" as never);
                    },
                  },
                ],
              )
            }
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>

          <Text style={styles.footerText}>Hive · v2.4.1</Text>
        </ScrollView>
      </View>
    </ProtectedRoute>
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
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 22,
      color: colors.tint,
      fontFamily: "Inter_700Bold",
    },
    profileName: {
      fontSize: 17,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    profileMeta: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    profileTitle: {
      fontSize: 12,
      color: colors.tint,
      fontFamily: "Inter_500Medium",
      marginTop: 4,
    },
    sectionLabel: {
      fontSize: 13,
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
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 14,
      gap: 10,
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
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
    rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
    rowValue: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
    },
    signOutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#FEE2E2",
      backgroundColor: "#FEF2F2",
      marginBottom: 16,
    },
    signOutText: {
      color: "#EF4444",
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
    footerText: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
    },
  });
}
