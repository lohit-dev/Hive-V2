import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";

export default function AboutScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const links = [
    {
      label: "Terms of service",
      icon: "document-text-outline" as const,
      url: "https://example.com/terms",
    },
    {
      label: "Privacy policy",
      icon: "shield-checkmark-outline" as const,
      url: "https://example.com/privacy",
    },
    {
      label: "Open source licenses",
      icon: "code-slash-outline" as const,
      url: "https://example.com/oss",
    },
    {
      label: "Visit our website",
      icon: "globe-outline" as const,
      url: "https://example.com",
    },
  ];

  const credits = [
    { label: "Version", value: "2.4.1" },
    { label: "Build", value: "240412.1" },
    { label: "Released", value: "Apr 12, 2026" },
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
        <Text style={styles.headerTitle}>About</Text>
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
        <View style={styles.heroCard}>
          <View style={styles.logoBig}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Hive</Text>
          <Text style={styles.appTagline}>
            The job search that works for you.
          </Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionPillText}>v2.4.1</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>App info</Text>
        <View style={styles.card}>
          {credits.map((c, idx) => (
            <View
              key={c.label}
              style={[styles.row, idx < credits.length - 1 && styles.rowBorder]}
            >
              <Text style={styles.rowTitle}>{c.label}</Text>
              <Text style={styles.rowValue}>{c.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Resources</Text>
        <View style={styles.card}>
          {links.map((l, idx) => (
            <Pressable
              key={l.label}
              style={({ pressed }) => [
                styles.row,
                idx < links.length - 1 && styles.rowBorder,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => Linking.openURL(l.url).catch(() => {})}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons name={l.icon} size={20} color={colors.tint} />
                </View>
                <Text style={styles.rowTitle}>{l.label}</Text>
              </View>
              <Feather
                name="external-link"
                size={16}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>Crafted with care · © 2026 Hive Labs</Text>
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
    heroCard: {
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 28,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    logoBig: {
      width: 88,
      height: 88,
      borderRadius: 24,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    logoImage: {
      width: 80,
      height: 80,
    },
    appName: {
      fontSize: 24,
      color: colors.text,
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.4,
    },
    appTagline: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 6,
      textAlign: "center",
    },
    versionPill: {
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.tintLight,
    },
    versionPillText: {
      color: colors.tint,
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
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
      fontFamily: "Inter_500Medium",
    },
    rowValue: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
    },
    footer: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      marginTop: 8,
    },
  });
}
