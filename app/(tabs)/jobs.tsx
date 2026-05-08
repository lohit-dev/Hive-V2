import { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
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
import { router } from "expo-router";

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
  description: string;
  requirements: string[];
}

const FILTERS = ["All", "Remote", "Onsite", "Full Time", "Part-Time", "Hybrid"];

function createStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
    stickyHeader: {
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    jobsScrollView: { flex: 1 },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    title: { fontSize: 26, fontFamily: "Inter_700Bold", color: colors.text },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: colors.tintLight,
    },
    sortButtonText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.tint,
    },
    statsBar: { flexDirection: "row", gap: 10, marginBottom: 16 },
    statPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statPillText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.textSecondary,
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
    expandedSection: {
      paddingTop: 4,
      paddingBottom: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginBottom: 12,
      marginTop: 4,
    },
    descriptionText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.text,
      lineHeight: 22,
      marginTop: 12,
      marginBottom: 14,
    },
    requirementsTitle: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginBottom: 8,
    },
    requirementsList: { gap: 6, marginBottom: 16 },
    requirementItem: { flexDirection: "row", alignItems: "center", gap: 8 },
    requirementDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.tint,
    },
    requirementText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    applyButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.tint,
      borderRadius: 12,
      paddingVertical: 14,
    },
    applyButtonText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
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
      paddingVertical: 60,
      gap: 10,
    },
    emptyIconWrap: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.categoryBg,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
}

const ALL_JOBS: Job[] = [
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
    description:
      "Build and maintain scalable web applications using React, Node.js, and PostgreSQL. Collaborate with cross-functional teams.",
    requirements: [
      "3+ years experience",
      "React & Node.js",
      "PostgreSQL",
      "REST APIs",
    ],
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
    description:
      "Develop cross-platform mobile applications using React Native and Expo. Work on performance optimization and native modules.",
    requirements: ["2+ years mobile dev", "React Native", "TypeScript", "Expo"],
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
    description:
      "Design and implement backend services using Go and microservices architecture. Handle high-traffic systems.",
    requirements: ["4+ years backend", "Go or Rust", "Microservices", "AWS"],
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
    description:
      "Manage CI/CD pipelines, infrastructure as code, and cloud deployments. Ensure system reliability and scalability.",
    requirements: [
      "3+ years DevOps",
      "Kubernetes",
      "Terraform",
      "CI/CD pipelines",
    ],
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
    description:
      "Create stunning user interfaces and conduct user research. Design wireframes, prototypes, and high-fidelity mockups.",
    requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "AnalytiQ Labs",
    companyColor: "#0EA5E9",
    companyLabel: "AnalytiQ",
    location: "Bali, Indonesia",
    salary: "INR 45.000.000",
    tags: ["Remote", "Full Time"],
    timeAgo: "4 days ago",
    bookmarked: false,
    description:
      "Analyze large datasets, build ML models, and derive actionable insights. Work with Python and TensorFlow.",
    requirements: ["Python", "TensorFlow", "SQL", "Statistics"],
  },
  {
    id: "7",
    title: "Product Manager",
    company: "StartupHub ID",
    companyColor: "#10B981",
    companyLabel: "StartupHub",
    location: "Jakarta, Indonesia",
    salary: "INR 38.000.000",
    tags: ["Onsite", "Full Time"],
    timeAgo: "6 days ago",
    bookmarked: false,
    description:
      "Drive product strategy, define roadmaps, and coordinate with engineering and design teams to ship features.",
    requirements: [
      "3+ years PM experience",
      "Agile",
      "Data-driven",
      "Stakeholder management",
    ],
  },
  {
    id: "8",
    title: "iOS Developer",
    company: "AppForge Co.",
    companyColor: "#6366F1",
    companyLabel: "AppForge",
    location: "Medan, Indonesia",
    salary: "INR 32.000.000",
    tags: ["Full Time", "Onsite"],
    timeAgo: "2 days ago",
    bookmarked: false,
    description:
      "Build high-quality iOS apps using Swift and SwiftUI. Optimize performance and ensure code quality through testing.",
    requirements: ["Swift", "SwiftUI", "Xcode", "Unit Testing"],
  },
  {
    id: "9",
    title: "Cloud Architect",
    company: "NexGen Cloud",
    companyColor: "#F97316",
    companyLabel: "NexGen",
    location: "Remote",
    salary: "INR 55.000.000",
    tags: ["Remote", "Part-Time"],
    timeAgo: "1 day ago",
    bookmarked: false,
    description:
      "Architect cloud infrastructure solutions on AWS and GCP. Lead migration projects and optimize cloud spending.",
    requirements: [
      "AWS Solutions Architect",
      "GCP",
      "Infrastructure as Code",
      "Security",
    ],
  },
  {
    id: "10",
    title: "QA Engineer",
    company: "QualityFirst Tech",
    companyColor: "#14B8A6",
    companyLabel: "QFirst",
    location: "Semarang, Indonesia",
    salary: "INR 22.000.000",
    tags: ["Full Time", "Hybrid"],
    timeAgo: "3 days ago",
    bookmarked: false,
    description:
      "Design and execute test plans, automate testing processes, and ensure software quality across web and mobile platforms.",
    requirements: [
      "Selenium/Cypress",
      "API Testing",
      "Test Automation",
      "JIRA",
    ],
  },
];

function JobCard({
  job,
  onToggleBookmark,
  expanded,
  onToggleExpand,
  styles,
  colors,
}: {
  job: Job;
  onToggleBookmark: (id: string) => void;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
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

      {expanded && (
        <View style={styles.expandedSection}>
          <Text style={styles.descriptionText}>{job.description}</Text>
          <Text style={styles.requirementsTitle}>Requirements</Text>
          <View style={styles.requirementsList}>
            {job.requirements.map((req) => (
              <View key={req} style={styles.requirementItem}>
                <View style={styles.requirementDot} />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.applyButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            }
          >
            <Text style={styles.applyButtonText}>Apply Now</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

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

export default function JobsScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [jobs, setJobs] = useState<Job[]>(ALL_JOBS);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "salary">("newest");

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

  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedJob(expandedJob === id ? null : id);
    },
    [expandedJob],
  );

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
        <View style={styles.headerRow}>
          <Text style={styles.title}>All Jobs</Text>
          <Pressable
            style={styles.sortButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSortBy(sortBy === "newest" ? "salary" : "newest");
            }}
          >
            <Feather name="sliders" size={18} color={colors.tint} />
            <Text style={styles.sortButtonText}>
              {sortBy === "newest" ? "Newest" : "Salary"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statPill}>
            <Ionicons name="briefcase-outline" size={14} color={colors.tint} />
            <Text style={styles.statPillText}>
              {filteredJobs.length} jobs found
            </Text>
          </View>
          <View style={styles.statPill}>
            <Ionicons name="globe-outline" size={14} color={colors.tint} />
            <Text style={styles.statPillText}>
              {
                filteredJobs.filter((j) =>
                  j.tags.some((t) => t.toLowerCase() === "remote"),
                ).length
              }{" "}
              remote
            </Text>
          </View>
        </View>

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
      </View>

      <ScrollView
        style={styles.jobsScrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Platform.OS === "web" ? 84 + 34 : 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onToggleBookmark={toggleBookmark}
            expanded={expandedJob === job.id}
            onToggleExpand={toggleExpand}
            styles={styles}
            colors={colors}
          />
        ))}

        {filteredJobs.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Feather
                name="briefcase"
                size={48}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptyText}>
              Try a different filter to find more jobs
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
