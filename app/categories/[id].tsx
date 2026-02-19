import { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "constants/useThemeColors";

interface Job {
  id: string;
  title: string;
  company: string;
  companyColor: string;
  companyLabel: string;
  location: string;
  salary: string;
  tags: string[];
  timeAgo: string;
}

const CATEGORY_JOBS: Record<string, Job[]> = {
  "IT & Engineering": [
    {
      id: "1",
      title: "Full Stack Developer",
      company: "PT Uniclov Int.",
      companyColor: "#DC2626",
      companyLabel: "UC",
      location: "Bandung, Jawa Barat",
      salary: "INR 35.000.000",
      tags: ["Full Time", "Remote"],
      timeAgo: "2 days ago",
    },
    {
      id: "4",
      title: "DevOps Specialist",
      company: "Cloudify Networks",
      companyColor: "#8B5CF6",
      companyLabel: "CN",
      location: "Remote",
      salary: "INR 40.000.000",
      tags: ["Remote", "Full Time"],
      timeAgo: "3 days ago",
    },
    {
      id: "3",
      title: "Backend Engineer",
      company: "Technoverse Solutions",
      companyColor: "#F59E0B",
      companyLabel: "TS",
      location: "Surabaya, Jawa Timur",
      salary: "INR 30.000.000",
      tags: ["Full Time", "Onsite"],
      timeAgo: "1 week ago",
    },
  ],
  default: [
    {
      id: "10",
      title: "Senior Specialist",
      company: "Global Corp",
      companyColor: "#2563EB",
      companyLabel: "GC",
      location: "Jakarta, Indonesia",
      salary: "INR 28.000.000",
      tags: ["Full Time", "Hybrid"],
      timeAgo: "1 day ago",
    },
    {
      id: "11",
      title: "Junior Analyst",
      company: "StartUp Hub",
      companyColor: "#059669",
      companyLabel: "SH",
      location: "Bandung, Jawa Barat",
      salary: "INR 15.000.000",
      tags: ["Full Time", "Onsite"],
      timeAgo: "3 days ago",
    },
    {
      id: "12",
      title: "Team Lead",
      company: "Innovate Co.",
      companyColor: "#EC4899",
      companyLabel: "IC",
      location: "Remote",
      salary: "INR 45.000.000",
      tags: ["Remote", "Full Time"],
      timeAgo: "5 days ago",
    },
  ],
};

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
      maxWidth: 200,
    },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
    resultCount: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.textSecondary,
      marginBottom: 16,
    },
    jobCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    jobTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    companyLogo: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    companyLogoText: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    jobInfo: { flex: 1 },
    jobTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginBottom: 2,
    },
    jobCompany: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    jobMeta: { flexDirection: "row", gap: 16, marginBottom: 12 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    metaText: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    jobBottom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    salary: { fontSize: 15, fontFamily: "Inter_700Bold", color: colors.salary },
    tagRow: { flexDirection: "row", gap: 6 },
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      backgroundColor: colors.tagBg,
    },
    tagText: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: colors.tagText,
    },
  });
}

export default function CategoryDetailScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const categoryName = id ?? "Category";

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const jobs = CATEGORY_JOBS[categoryName] ?? CATEGORY_JOBS["default"];

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
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {categoryName}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 : Math.max(insets.bottom, 16),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultCount}>{jobs.length} jobs found</Text>

        {jobs.map((job) => (
          <Pressable
            key={job.id}
            style={({ pressed }) => [
              styles.jobCard,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({ pathname: "/job/[id]", params: { id: job.id } });
            }}
          >
            <View style={styles.jobTop}>
              <View
                style={[
                  styles.companyLogo,
                  { backgroundColor: job.companyColor },
                ]}
              >
                <Text style={styles.companyLogoText}>{job.companyLabel}</Text>
              </View>
              <View style={styles.jobInfo}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCompany}>{job.company}</Text>
              </View>
              <Pressable
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <Ionicons
                  name="bookmark-outline"
                  size={20}
                  color={colors.bookmarkIcon}
                />
              </Pressable>
            </View>
            <View style={styles.jobMeta}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text style={styles.metaText}>{job.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text style={styles.metaText}>{job.timeAgo}</Text>
              </View>
            </View>
            <View style={styles.jobBottom}>
              <Text style={styles.salary}>{job.salary}</Text>
              <View style={styles.tagRow}>
                {job.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
