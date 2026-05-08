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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";

export default function PrivacyScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [profileVisible, setProfileVisible] = useState(true);
  const [searchable, setSearchable] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [dataPersonalization, setDataPersonalization] = useState(true);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const toggles = [
    {
      key: "profile",
      label: "Profile visibility",
      desc: "Allow recruiters to see your profile",
      icon: "eye-outline" as const,
      val: profileVisible,
      set: setProfileVisible,
    },
    {
      key: "search",
      label: "Discoverable in search",
      desc: "Show your profile in search results",
      icon: "search-outline" as const,
      val: searchable,
      set: setSearchable,
    },
    {
      key: "activity",
      label: "Share activity",
      desc: "Let connections see your job activity",
      icon: "pulse-outline" as const,
      val: shareActivity,
      set: setShareActivity,
    },
    {
      key: "analytics",
      label: "Usage analytics",
      desc: "Help us improve with anonymous data",
      icon: "stats-chart-outline" as const,
      val: analytics,
      set: setAnalytics,
    },
    {
      key: "marketing",
      label: "Marketing emails",
      desc: "News, tips and product updates",
      icon: "megaphone-outline" as const,
      val: marketing,
      set: setMarketing,
    },
    {
      key: "personalization",
      label: "Personalize recommendations",
      desc: "Use your activity to suggest jobs",
      icon: "sparkles-outline" as const,
      val: dataPersonalization,
      set: setDataPersonalization,
    },
  ];

  const dataActions = [
    { label: "Download my data", icon: "download-outline" as const },
    { label: "Blocked accounts", icon: "ban-outline" as const },
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
        <Text style={styles.headerTitle}>Privacy</Text>
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
        <Text style={styles.sectionLabel}>Visibility</Text>
        <View style={styles.card}>
          {toggles.map((t, idx) => (
            <View
              key={t.key}
              style={[styles.row, idx < toggles.length - 1 && styles.rowBorder]}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons name={t.icon} size={20} color={colors.tint} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{t.label}</Text>
                  <Text style={styles.rowSub}>{t.desc}</Text>
                </View>
              </View>
              <Switch
                value={t.val}
                onValueChange={(v) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  t.set(v);
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.card}>
          {dataActions.map((a, idx) => (
            <Pressable
              key={a.label}
              style={({ pressed }) => [
                styles.row,
                idx < dataActions.length - 1 && styles.rowBorder,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons name={a.icon} size={20} color={colors.tint} />
                </View>
                <Text style={styles.rowTitle}>{a.label}</Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.dangerBtn,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() =>
            Alert.alert(
              "Delete account?",
              "This permanently removes your data. You can't undo this.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive" },
              ],
            )
          }
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={styles.dangerBtnText}>Delete account</Text>
        </Pressable>
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
      marginBottom: 24,
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
    dangerBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#FEE2E2",
      backgroundColor: "#FEF2F2",
    },
    dangerBtnText: {
      color: "#EF4444",
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
