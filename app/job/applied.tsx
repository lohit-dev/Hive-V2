import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
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
import { useAuthStore } from "@/stores/authStore";

export default function AppliedScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const params = useLocalSearchParams<{
    title?: string;
    company?: string;
    location?: string;
  }>();

  const title = params.title ?? "Senior Product Designer";
  const company = params.company ?? "Acme Studios";
  const location = params.location ?? "Remote";

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const timeline = [
    {
      title: "Application sent",
      desc: "Your resume and profile were delivered.",
      icon: "checkmark-circle" as const,
      done: true,
    },
    {
      title: "Recruiter review",
      desc: "Usually within 3–5 business days.",
      icon: "search-circle-outline" as const,
      done: false,
    },
    {
      title: "Interview invite",
      desc: "We'll notify you the moment it lands.",
      icon: "calendar-outline" as const,
      done: false,
    },
  ];

  const tips = [
    {
      title: "Keep your profile fresh",
      desc: "Updated profiles get noticed 3× more often.",
      icon: "sparkles-outline" as const,
      action: () => router.push("/profile/edit" as never),
    },
    {
      title: "Set up job alerts",
      desc: "Get matched as soon as similar roles open.",
      icon: "notifications-outline" as const,
      action: () => router.push("/profile/preferences" as never),
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
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Application sent</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Platform.OS === "web" ? 110 : insets.bottom + 110,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={42} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>You&apos;re in!</Text>
          <Text style={styles.successSub}>
            Hey {user?.name?.split(" ")[0] ?? "there"}, your application was
            submitted successfully.
          </Text>

          <View style={styles.jobMeta}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.jobCompany} numberOfLines={1}>
              {company} · {location}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>13</Text>
            <Text style={styles.statLabel}>Total applied</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>72%</Text>
            <Text style={styles.statLabel}>Response rate</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>What happens next</Text>
        <View style={styles.timelineCard}>
          {timeline.map((step, idx) => {
            const last = idx === timeline.length - 1;
            return (
              <View key={step.title} style={styles.timelineRow}>
                <View style={styles.timelineCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      step.done && {
                        backgroundColor: colors.tint,
                        borderColor: colors.tint,
                      },
                    ]}
                  >
                    <Ionicons
                      name={step.icon}
                      size={16}
                      color={step.done ? "#FFFFFF" : colors.tint}
                    />
                  </View>
                  {!last && (
                    <View
                      style={[
                        styles.timelineLine,
                        step.done && { backgroundColor: colors.tint },
                      ]}
                    />
                  )}
                </View>
                <View
                  style={[styles.timelineText, !last && { paddingBottom: 18 }]}
                >
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineDesc}>{step.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>While you wait</Text>
        <View style={{ gap: 10 }}>
          {tips.map((t) => (
            <Pressable
              key={t.title}
              style={({ pressed }) => [
                styles.tipCard,
                pressed && { opacity: 0.7 },
              ]}
              onPress={t.action}
            >
              <View style={styles.tipIcon}>
                <Ionicons name={t.icon} size={20} color={colors.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>{t.title}</Text>
                <Text style={styles.tipDesc}>{t.desc}</Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 12,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.secondaryBtn,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.replace("/profile/applications")}
        >
          <Text style={styles.secondaryBtnText}>View applications</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.primaryBtnText}>Find more jobs</Text>
        </Pressable>
      </View>
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
    successCard: {
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 22,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    successIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      shadowColor: colors.tint,
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    successTitle: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      letterSpacing: -0.4,
    },
    successSub: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 6,
      textAlign: "center",
      maxWidth: 280,
    },
    jobMeta: {
      width: "100%",
      marginTop: 18,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: "center",
    },
    jobTitle: {
      fontSize: 15,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    jobCompany: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
      marginTop: 4,
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 24,
    },
    statBox: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 16,
      borderRadius: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 20,
      color: colors.text,
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.3,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
      marginTop: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.4,
    },
    sectionLabel: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.textSecondary,
      marginBottom: 12,
      marginLeft: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    timelineCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 24,
    },
    timelineRow: { flexDirection: "row", gap: 12 },
    timelineCol: { alignItems: "center", width: 28 },
    timelineDot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    timelineLine: {
      width: 2,
      flex: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
    },
    timelineText: { flex: 1 },
    timelineTitle: {
      fontSize: 14,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    timelineDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    tipCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    tipIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    tipTitle: {
      fontSize: 14,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    tipDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 20,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    secondaryBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      backgroundColor: colors.surface,
    },
    secondaryBtnText: {
      color: colors.text,
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
    primaryBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: colors.tint,
      alignItems: "center",
    },
    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
