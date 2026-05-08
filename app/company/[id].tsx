import { Feather, Ionicons } from "@expo/vector-icons";
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

const COMPANY_DATA: Record<
  string,
  {
    name: string;
    tagline: string;
    industry: string;
    size: string;
    founded: string;
    location: string;
    website: string;
    about: string;
    perks: string[];
    openRoles: { id: string; title: string; location: string; type: string }[];
  }
> = {
  default: {
    name: "Acme Studios",
    tagline: "Designing the next era of digital products",
    industry: "Software & Design",
    size: "200-500",
    founded: "2014",
    location: "San Francisco, CA",
    website: "acme.studio",
    about:
      "Acme is a remote-first product studio building tools used by millions of creators worldwide. We obsess over craft, ship continuously, and treat design as a first-class engineering discipline.",
    perks: [
      "Remote anywhere",
      "Unlimited PTO",
      "Annual offsite",
      "Top-tier equipment",
      "Wellness stipend",
      "Learning budget",
    ],
    openRoles: [
      {
        id: "r1",
        title: "Senior Product Designer",
        location: "Remote",
        type: "Full-time",
      },
      {
        id: "r2",
        title: "Frontend Engineer",
        location: "San Francisco",
        type: "Full-time",
      },
      {
        id: "r3",
        title: "Brand Designer",
        location: "Remote",
        type: "Contract",
      },
    ],
  },
};

export default function CompanyDetailScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [following, setFollowing] = useState(false);

  const company = COMPANY_DATA["default"]!;
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          Company
        </Text>
        <Pressable style={styles.headerBtn}>
          <Feather name="share-2" size={20} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Platform.OS === "web" ? 60 : insets.bottom + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.logoBig}>
            <Text style={styles.logoBigText}>{company.name.charAt(0)}</Text>
          </View>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.tagline}>{company.tagline}</Text>
          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.metaText}>{company.location}</Text>
            <Text style={styles.metaDot}>·</Text>
            <Ionicons
              name="people-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.metaText}>{company.size}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[
                styles.followBtn,
                following && {
                  backgroundColor: colors.tintLight,
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFollowing((v) => !v);
              }}
            >
              <Ionicons
                name={following ? "checkmark" : "add"}
                size={16}
                color={following ? colors.tint : "#FFFFFF"}
              />
              <Text
                style={[styles.followText, following && { color: colors.tint }]}
              >
                {following ? "Following" : "Follow"}
              </Text>
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Feather name="globe" size={16} color={colors.text} />
              <Text style={styles.iconBtnText}>Website</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statValue}>{company.openRoles.length}</Text>
            <Text style={styles.statLabel}>Open roles</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statValue}>{company.industry}</Text>
            <Text style={styles.statLabel}>Industry</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statValue}>{company.founded}</Text>
            <Text style={styles.statLabel}>Founded</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <Text style={styles.aboutText}>{company.about}</Text>
        </View>

        <Text style={styles.sectionLabel}>Benefits & perks</Text>
        <View style={styles.perkGrid}>
          {company.perks.map((perk) => (
            <View key={perk} style={styles.perkChip}>
              <Ionicons name="checkmark-circle" size={14} color={colors.tint} />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Open roles</Text>
        <View style={{ gap: 10 }}>
          {company.openRoles.map((role) => (
            <Pressable
              key={role.id}
              style={({ pressed }) => [
                styles.roleCard,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => router.push(`/job/${role.id}`)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleMeta}>
                  {role.location} · {role.type}
                </Text>
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
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      marginBottom: 16,
    },
    logoBig: {
      width: 72,
      height: 72,
      borderRadius: 18,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    logoBigText: {
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      color: colors.tint,
    },
    companyName: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      letterSpacing: -0.4,
    },
    tagline: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
      textAlign: "center",
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 10,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
    },
    metaDot: { color: colors.textSecondary, marginHorizontal: 4 },
    actions: { flexDirection: "row", gap: 10, marginTop: 16, width: "100%" },
    followBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      backgroundColor: colors.tint,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.tint,
    },
    followText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
    iconBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    iconBtnText: {
      color: colors.text,
      fontSize: 14,
      fontFamily: "Inter_500Medium",
    },
    statsRow: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    statCol: { flex: 1, alignItems: "center" },
    statValue: {
      fontSize: 14,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
      textAlign: "center",
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginHorizontal: 8,
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
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    aboutText: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.text,
      fontFamily: "Inter_400Regular",
    },
    perkGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 20,
    },
    perkChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    perkText: {
      fontSize: 12,
      color: colors.text,
      fontFamily: "Inter_500Medium",
    },
    roleCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    roleTitle: {
      fontSize: 15,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    roleMeta: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
    },
  });
}
