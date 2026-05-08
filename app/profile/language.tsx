import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
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

const LANGUAGES = [
  { code: "en", label: "English", region: "US" },
  { code: "es", label: "Español", region: "ES" },
  { code: "fr", label: "Français", region: "FR" },
  { code: "de", label: "Deutsch", region: "DE" },
  { code: "pt", label: "Português", region: "BR" },
  { code: "it", label: "Italiano", region: "IT" },
  { code: "ja", label: "日本語", region: "JP" },
  { code: "ko", label: "한국어", region: "KR" },
  { code: "zh", label: "中文", region: "CN" },
  { code: "hi", label: "हिन्दी", region: "IN" },
];

export default function LanguageScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("en");

  const webTopInset = Platform.OS === "web" ? 67 : 0;

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
        <Text style={styles.headerTitle}>Language</Text>
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
        <Text style={styles.sectionLabel}>Choose a language</Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang, idx) => {
            const active = selected === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={({ pressed }) => [
                  styles.row,
                  idx < LANGUAGES.length - 1 && styles.rowBorder,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelected(lang.code);
                }}
              >
                <View style={styles.rowLeft}>
                  <View style={styles.flagWrap}>
                    <Text style={styles.flagText}>{lang.region}</Text>
                  </View>
                  <Text style={styles.rowTitle}>{lang.label}</Text>
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
      gap: 14,
      flex: 1,
    },
    flagWrap: {
      width: 36,
      height: 28,
      borderRadius: 6,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    flagText: {
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      color: colors.tint,
      letterSpacing: 0.5,
    },
    rowTitle: {
      fontSize: 15,
      color: colors.text,
      fontFamily: "Inter_500Medium",
    },
  });
}
