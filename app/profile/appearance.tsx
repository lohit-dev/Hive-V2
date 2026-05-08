import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";
import { useThemeStore, useResolvedTheme } from "@/stores/themeStore";

export default function AppearanceScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { preference } = useResolvedTheme();
  const setPreference = useThemeStore((state) => state.setPreference);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const options: {
    key: "system" | "light" | "dark";
    title: string;
    desc: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }[] = [
    {
      key: "system",
      title: "Match system",
      desc: "Follow your device setting",
      icon: "phone-portrait-outline",
    },
    {
      key: "light",
      title: "Light",
      desc: "Bright background, dark text",
      icon: "sunny-outline",
    },
    {
      key: "dark",
      title: "Dark",
      desc: "Easier on the eyes at night",
      icon: "moon-outline",
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
        <Text style={styles.headerTitle}>Appearance</Text>
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
        <View style={styles.previewRow}>
          <View style={[styles.previewCard, { backgroundColor: "#FFFFFF" }]}>
            <View style={[styles.previewBar, { backgroundColor: "#F4F4F5" }]} />
            <View
              style={[styles.previewLine, { backgroundColor: "#18181B" }]}
            />
            <View
              style={[
                styles.previewLine,
                { backgroundColor: "#A1A1AA", width: "60%" },
              ]}
            />
            <Text style={styles.previewLabel}>Light</Text>
          </View>
          <View style={[styles.previewCard, { backgroundColor: "#0B0B0F" }]}>
            <View style={[styles.previewBar, { backgroundColor: "#1E1E26" }]} />
            <View
              style={[styles.previewLine, { backgroundColor: "#FFFFFF" }]}
            />
            <View
              style={[
                styles.previewLine,
                { backgroundColor: "#A1A1AA", width: "60%" },
              ]}
            />
            <Text style={[styles.previewLabel, { color: "#FFFFFF" }]}>
              Dark
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Theme</Text>
        <View style={styles.card}>
          {options.map((opt, idx) => {
            const active = preference === opt.key;
            return (
              <Pressable
                key={opt.key}
                style={({ pressed }) => [
                  styles.row,
                  idx < options.length - 1 && styles.rowBorder,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setPreference(opt.key);
                }}
              >
                <View style={styles.rowLeft}>
                  <View
                    style={[
                      styles.iconWrap,
                      active && { backgroundColor: colors.tint },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={active ? "#FFFFFF" : colors.tint}
                    />
                  </View>
                  <View>
                    <Text style={styles.rowTitle}>{opt.title}</Text>
                    <Text style={styles.rowSub}>{opt.desc}</Text>
                  </View>
                </View>
                {active && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={colors.tint}
                  />
                )}
              </Pressable>
            );
          })}
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
    previewRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
    previewCard: {
      flex: 1,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    previewBar: {
      height: 12,
      borderRadius: 6,
      width: "70%",
    },
    previewLine: { height: 8, borderRadius: 4, width: "100%" },
    previewLabel: {
      marginTop: 12,
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "#18181B",
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
      width: 40,
      height: 40,
      borderRadius: 12,
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
