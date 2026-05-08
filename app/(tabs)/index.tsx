import { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/useThemeColors";
import { useAuthStore } from "@/stores/authStore";

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
  bookmarked: boolean;
}

const CATEGORIES: {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  categoryId: string | null;
}[] = [
  {
    id: "1",
    name: "IT &\nEngineering",
    icon: "desktop-outline" as const,
    categoryId: "IT & Engineering",
  },
  {
    id: "2",
    name: "Education",
    icon: "school-outline" as const,
    categoryId: "Education",
  },
  {
    id: "3",
    name: "Finance",
    icon: "cash-outline" as const,
    categoryId: "Finance",
  },
  {
    id: "4",
    name: "Healthcare",
    icon: "pulse-outline" as const,
    categoryId: "Healthcare",
  },
  {
    id: "5",
    name: "Creative\nArts",
    icon: "color-palette-outline" as const,
    categoryId: "Creative Arts",
  },
  {
    id: "6",
    name: "See more",
    icon: "ellipsis-horizontal" as const,
    categoryId: null,
  },
];

const FILTERS = ["All", "Remote", "Onsite", "Full Time", "Part-Time"];

const INITIAL_JOBS: Job[] = [
  {
    id: "1",
    title: "Full Stack Developer",
    company: "PT Uniclov Int.",
    companyColor: "#DC2626",
    companyLabel: "Uniclov",
    location: "Bandung, Jawa Barat",
    salary: "INR 35.000.000",
    tags: ["Full Time", "Remote"],
    timeAgo: "2 days ago",
    bookmarked: false,
  },
  {
    id: "2",
    title: "React Native Wizard",
    company: "Bullshit Incorporated",
    companyColor: "#1E3A5F",
    companyLabel: "Bullshit\nInc.",
    location: "Jakarta, Indonesia",
    salary: "INR 25.000.000",
    tags: ["Hybrid", "Full Time"],
    timeAgo: "5 days ago",
    bookmarked: false,
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "Technoverse Solutions",
    companyColor: "#F59E0B",
    companyLabel: "Technov\nerse",
    location: "Surabaya, Jawa Timur",
    salary: "INR 30.000.000",
    tags: ["Full Time", "Onsite"],
    timeAgo: "1 week ago",
    bookmarked: false,
  },
  {
    id: "4",
    title: "DevOps Specialist",
    company: "Cloudify Networks",
    companyColor: "#8B5CF6",
    companyLabel: "Cloudify",
    location: "Remote",
    salary: "INR 40.000.000",
    tags: ["Remote", "Full Time"],
    timeAgo: "3 days ago",
    bookmarked: false,
  },
  {
    id: "5",
    title: "UI/UX Designer",
    company: "PixelCraft Studio",
    companyColor: "#EC4899",
    companyLabel: "PixelCraft",
    location: "Yogyakarta, Indonesia",
    salary: "INR 20.000.000",
    tags: ["Full Time", "Hybrid"],
    timeAgo: "1 day ago",
    bookmarked: false,
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "AnalytiQ Labs",
    companyColor: "#0EA5E9",
    companyLabel: "AnalytiQ",
    location: "Singapore",
    salary: "SGD 8.500 / mo",
    tags: ["Remote", "Full Time"],
    timeAgo: "6 hours ago",
    bookmarked: false,
  },
  {
    id: "7",
    title: "Product Manager",
    company: "StartupHub Asia",
    companyColor: "#10B981",
    companyLabel: "StartupHub",
    location: "Hong Kong",
    salary: "HKD 60.000 / mo",
    tags: ["Hybrid", "Full Time"],
    timeAgo: "12 hours ago",
    bookmarked: true,
  },
  {
    id: "8",
    title: "iOS Engineer",
    company: "AppForge Studio",
    companyColor: "#6366F1",
    companyLabel: "AppForge",
    location: "Tokyo, Japan",
    salary: "JPY 9.000.000",
    tags: ["Full Time", "Onsite"],
    timeAgo: "1 day ago",
    bookmarked: false,
  },
  {
    id: "9",
    title: "Marketing Lead",
    company: "NexGen Media",
    companyColor: "#F97316",
    companyLabel: "NexGen",
    location: "Sydney, Australia",
    salary: "AUD 110.000",
    tags: ["Remote", "Full Time"],
    timeAgo: "2 days ago",
    bookmarked: false,
  },
  {
    id: "10",
    title: "QA Automation Engineer",
    company: "QualityFirst Inc.",
    companyColor: "#14B8A6",
    companyLabel: "QFirst",
    location: "Manila, Philippines",
    salary: "PHP 120.000 / mo",
    tags: ["Full Time", "Remote"],
    timeAgo: "4 days ago",
    bookmarked: false,
  },
  {
    id: "11",
    title: "Mobile App Developer",
    company: "Bullshit Incorporated",
    companyColor: "#1E3A5F",
    companyLabel: "Bullshit\nInc.",
    location: "Bangkok, Thailand",
    salary: "THB 95.000 / mo",
    tags: ["Hybrid", "Part-Time"],
    timeAgo: "3 days ago",
    bookmarked: false,
  },
  {
    id: "12",
    title: "Cloud Solutions Architect",
    company: "Cloudify Networks",
    companyColor: "#8B5CF6",
    companyLabel: "Cloudify",
    location: "Remote",
    salary: "USD 145.000",
    tags: ["Remote", "Full Time"],
    timeAgo: "1 week ago",
    bookmarked: false,
  },
];

function CategoryCard({
  item,
  styles,
  colors,
}: {
  item: (typeof CATEGORIES)[0];
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.categoryCard,
        pressed && styles.categoryCardPressed,
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (item.categoryId) {
          router.push({
            pathname: "/categories/[id]",
            params: { id: item.categoryId },
          });
        } else {
          router.push("/categories");
        }
      }}
    >
      <Ionicons
        name={item.icon}
        size={28}
        color={colors.text}
        style={styles.categoryIcon}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
    </Pressable>
  );
}

function JobCard({
  job,
  onToggleBookmark,
  styles,
  colors,
}: {
  job: Job;
  onToggleBookmark: (id: string) => void;
  styles: ReturnType<typeof createStyles>;
  colors: ReturnType<typeof useThemeColors>;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.jobCard,
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/job/[id]", params: { id: job.id } });
      }}
    >
      <View style={styles.jobHeader}>
        <View
          style={[styles.companyLogo, { backgroundColor: job.companyColor }]}
        >
          <Text style={styles.companyLogoText}>{job.companyLabel}</Text>
        </View>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobCompany}>{job.company}</Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggleBookmark(job.id);
          }}
          hitSlop={12}
        >
          <Ionicons
            name={job.bookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={job.bookmarked ? colors.tint : colors.bookmarkIcon}
          />
        </Pressable>
      </View>
      <View style={styles.jobDetails}>
        <View style={styles.jobDetailRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.jobDetailText}>{job.location}</Text>
        </View>
        <View style={styles.jobDetailRow}>
          <Ionicons
            name="cash-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.jobDetailText}>{job.salary}</Text>
        </View>
      </View>
      <View style={styles.jobFooter}>
        <View style={styles.tagContainer}>
          {job.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.timeAgo}>{job.timeAgo}</Text>
      </View>
    </Pressable>
  );
}

function createStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    stickyHeader: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
    welcomeText: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 16,
    },
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.searchBg,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 48,
      gap: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.text,
    },
    notificationBtn: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 14,
    },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 28,
    },
    categoryCard: {
      width: "31%",
      backgroundColor: colors.categoryBg,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 12,
      minHeight: 90,
      justifyContent: "space-between",
    },
    categoryCardPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
    categoryIcon: { marginBottom: 10 },
    categoryName: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.text,
      lineHeight: 17,
    },
    filtersContainer: { gap: 8, paddingBottom: 16 },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    filterChipActive: {
      backgroundColor: colors.chipActiveBg,
      borderColor: colors.chipActiveBg,
    },
    filterChipText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.chipText,
    },
    filterChipTextActive: { color: colors.chipActiveText },
    jobCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    jobHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    companyLogo: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    companyLogoText: {
      fontSize: 8,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      textAlign: "center",
      lineHeight: 10,
    },
    jobInfo: { flex: 1 },
    jobTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginBottom: 2,
    },
    jobCompany: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    jobDetails: { gap: 6, marginBottom: 12 },
    jobDetailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    jobDetailText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    jobFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    tagContainer: { flexDirection: "row", gap: 8 },
    tag: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 14,
      backgroundColor: colors.tagBg,
    },
    tagText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.tagText,
    },
    timeAgo: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 48,
      gap: 12,
    },
    emptyStateText: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.textSecondary,
    },
  });
}

export default function HomeScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const [activeFilter, setActiveFilter] = useState("All");
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [searchQuery, setSearchQuery] = useState("");

  const firstName = (user?.name ?? "there").split(" ")[0];

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const toggleBookmark = useCallback((id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, bookmarked: !j.bookmarked } : j)),
    );
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (activeFilter === "All") return true;
    return job.tags.some(
      (tag) => tag.toLowerCase() === activeFilter.toLowerCase(),
    );
  });

  if (!fontsLoaded) return null;

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.stickyHeader,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 16,
          },
        ]}
      >
        <Text style={styles.welcomeText}>Welcome, {firstName}!</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find your dream job"
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if (searchQuery.trim()) {
                  Keyboard.dismiss();
                  router.push({
                    pathname: "/search-results",
                    params: { q: searchQuery.trim() },
                  });
                }
              }}
              returnKeyType="search"
            />
          </View>
          <Pressable
            style={styles.notificationBtn}
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Platform.OS === "web" ? 84 + 34 : 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.sectionTitle}>Browse by categories</Text>

        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              item={cat}
              styles={styles}
              colors={colors}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recommended Jobs</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map((filter) => (
            <Pressable
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter(filter);
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onToggleBookmark={toggleBookmark}
            styles={styles}
            colors={colors}
          />
        ))}

        {filteredJobs.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="briefcase" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No jobs found for this filter
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
