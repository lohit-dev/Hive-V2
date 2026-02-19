import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
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
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

const JOBS_DATA: Record<string, Job> = {
  "1": {
    id: "1",
    title: "Full Stack Developer",
    company: "PT Uniclov Int.",
    companyColor: "#DC2626",
    companyLabel: "Uniclov",
    location: "Bandung, Jawa Barat",
    salary: "INR 35.000.000",
    tags: ["Full Time", "Remote"],
    timeAgo: "2 days ago",
    description:
      "Build and maintain scalable web applications using React, Node.js, and PostgreSQL. Collaborate with cross-functional teams.",
    requirements: [
      "3+ years experience",
      "React & Node.js",
      "PostgreSQL",
      "REST APIs",
    ],
    responsibilities: [
      "Design and develop full-stack web applications",
      "Write clean, maintainable, and testable code",
      "Collaborate with cross-functional teams",
      "Participate in code reviews and technical discussions",
      "Optimize application performance and scalability",
    ],
    benefits: [
      "Competitive salary and equity",
      "Remote-first work culture",
      "Health insurance coverage",
      "Learning and development budget",
      "Flexible working hours",
    ],
  },
  "2": {
    id: "2",
    title: "React Native Wizard",
    company: "MobileFirst Co.",
    companyColor: "#1E3A5F",
    companyLabel: "MF",
    location: "Jakarta, Indonesia",
    salary: "INR 25.000.000",
    tags: ["Hybrid", "Full Time"],
    timeAgo: "5 days ago",
    description:
      "Build cutting-edge cross-platform mobile applications using React Native and Expo. Optimize performance and deliver pixel-perfect experiences.",
    requirements: [
      "2+ years React Native",
      "TypeScript",
      "Expo ecosystem",
      "State management",
    ],
    responsibilities: [
      "Develop and maintain React Native mobile applications",
      "Implement complex UI animations and interactions",
      "Integrate native modules and third-party libraries",
      "Write unit and integration tests",
      "Mentor junior developers on mobile best practices",
    ],
    benefits: [
      "Hybrid work arrangement",
      "Annual bonus program",
      "Tech gadget allowance",
      "Team outings and events",
      "Career growth opportunities",
    ],
  },
  "3": {
    id: "3",
    title: "Backend Engineer",
    company: "Technoverse Solutions",
    companyColor: "#F59E0B",
    companyLabel: "TV",
    location: "Surabaya, Jawa Timur",
    salary: "INR 30.000.000",
    tags: ["Full Time", "Onsite"],
    timeAgo: "1 week ago",
    description:
      "Design and implement robust backend services using Go and microservices architecture. Handle high-traffic systems serving millions of users daily.",
    requirements: [
      "4+ years backend development",
      "Go or Rust",
      "Microservices",
      "AWS services",
    ],
    responsibilities: [
      "Design and build scalable backend services",
      "Implement efficient data pipelines",
      "Ensure system reliability and uptime",
      "Participate in on-call rotations",
      "Document system architecture and APIs",
    ],
    benefits: [
      "Competitive salary package",
      "Health and dental insurance",
      "Annual performance bonus",
      "Professional development courses",
      "Office snacks and meals",
    ],
  },
  "4": {
    id: "4",
    title: "DevOps Specialist",
    company: "Cloudify Networks",
    companyColor: "#8B5CF6",
    companyLabel: "CN",
    location: "Remote",
    salary: "INR 40.000.000",
    tags: ["Remote", "Full Time"],
    timeAgo: "3 days ago",
    description:
      "Manage CI/CD pipelines, infrastructure as code, and cloud deployments. Ensure system reliability, scalability, and security.",
    requirements: [
      "3+ years DevOps",
      "Kubernetes & Docker",
      "Terraform",
      "CI/CD pipelines",
    ],
    responsibilities: [
      "Build and maintain CI/CD pipelines",
      "Manage cloud infrastructure with IaC",
      "Implement monitoring and alerting systems",
      "Automate deployment processes",
      "Collaborate with development teams on infrastructure needs",
    ],
    benefits: [
      "Fully remote position",
      "Home office stipend",
      "Unlimited PTO policy",
      "Conference attendance budget",
      "Stock options",
    ],
  },
  "5": {
    id: "5",
    title: "UI/UX Designer",
    company: "PixelCraft Studio",
    companyColor: "#EC4899",
    companyLabel: "PC",
    location: "Yogyakarta, Indonesia",
    salary: "INR 20.000.000",
    tags: ["Full Time", "Hybrid"],
    timeAgo: "1 day ago",
    description:
      "Create stunning user interfaces and conduct user research. Design wireframes, prototypes, and high-fidelity mockups.",
    requirements: [
      "Figma expertise",
      "User research",
      "Prototyping",
      "Design systems",
    ],
    responsibilities: [
      "Design intuitive user interfaces",
      "Conduct user interviews and usability tests",
      "Create and maintain design systems",
      "Collaborate with developers on implementation",
      "Present design concepts to stakeholders",
    ],
    benefits: [
      "Creative work environment",
      "Flexible schedule",
      "Design tool subscriptions",
      "Health benefits",
      "Team retreats",
    ],
  },
  "6": {
    id: "6",
    title: "Data Scientist",
    company: "DataMinds AI",
    companyColor: "#0EA5E9",
    companyLabel: "DM",
    location: "Jakarta, Indonesia",
    salary: "INR 45.000.000",
    tags: ["Full Time", "Remote"],
    timeAgo: "4 days ago",
    description:
      "Analyze large datasets, build ML models, and derive actionable insights. Work with Python and TensorFlow.",
    requirements: [
      "Python & TensorFlow",
      "SQL & Statistics",
      "Machine Learning",
      "Data visualization",
    ],
    responsibilities: [
      "Build predictive models and algorithms",
      "Analyze large-scale datasets",
      "Present findings to stakeholders",
      "Collaborate with engineering teams",
      "Stay current with ML research",
    ],
    benefits: [
      "Competitive compensation",
      "Remote work flexibility",
      "Research budget",
      "Health insurance",
      "Annual bonus",
    ],
  },
  "7": {
    id: "7",
    title: "Product Manager",
    company: "StartupHub ID",
    companyColor: "#10B981",
    companyLabel: "SH",
    location: "Jakarta, Indonesia",
    salary: "INR 38.000.000",
    tags: ["Onsite", "Full Time"],
    timeAgo: "6 days ago",
    description:
      "Drive product strategy, define roadmaps, and coordinate with engineering and design teams to ship features.",
    requirements: [
      "3+ years PM experience",
      "Agile methodology",
      "Data-driven decisions",
      "Stakeholder management",
    ],
    responsibilities: [
      "Define product vision and strategy",
      "Prioritize features and manage backlog",
      "Coordinate cross-functional teams",
      "Analyze user metrics",
      "Present to leadership",
    ],
    benefits: [
      "Leadership opportunity",
      "Equity package",
      "Health insurance",
      "Learning budget",
      "Team events",
    ],
  },
  "8": {
    id: "8",
    title: "iOS Developer",
    company: "AppForge Co.",
    companyColor: "#6366F1",
    companyLabel: "AF",
    location: "Medan, Indonesia",
    salary: "INR 32.000.000",
    tags: ["Full Time", "Onsite"],
    timeAgo: "2 days ago",
    description:
      "Build high-quality iOS apps using Swift and SwiftUI. Optimize performance and ensure code quality through testing.",
    requirements: [
      "Swift & SwiftUI",
      "Xcode",
      "Unit Testing",
      "App Store process",
    ],
    responsibilities: [
      "Develop iOS applications",
      "Implement UI from designs",
      "Write automated tests",
      "Optimize app performance",
      "Publish to App Store",
    ],
    benefits: [
      "Latest Apple hardware",
      "Health insurance",
      "Annual bonus",
      "Training budget",
      "Flexible hours",
    ],
  },
  "9": {
    id: "9",
    title: "Cloud Architect",
    company: "NexGen Cloud",
    companyColor: "#F97316",
    companyLabel: "NG",
    location: "Remote",
    salary: "INR 55.000.000",
    tags: ["Remote", "Part-Time"],
    timeAgo: "1 day ago",
    description:
      "Design and implement cloud infrastructure solutions. Lead migration projects and ensure security best practices.",
    requirements: [
      "AWS/Azure/GCP",
      "Infrastructure as Code",
      "Security best practices",
      "Architecture patterns",
    ],
    responsibilities: [
      "Design cloud architecture",
      "Lead migration projects",
      "Implement security standards",
      "Mentor engineering teams",
      "Cost optimization",
    ],
    benefits: [
      "Premium compensation",
      "Fully remote",
      "Flexible schedule",
      "Conference budget",
      "Stock options",
    ],
  },
  "10": {
    id: "10",
    title: "QA Engineer",
    company: "QualityFirst Tech",
    companyColor: "#14B8A6",
    companyLabel: "QF",
    location: "Semarang, Indonesia",
    salary: "INR 22.000.000",
    tags: ["Full Time", "Hybrid"],
    timeAgo: "3 days ago",
    description:
      "Design and execute test plans, automate testing processes, and ensure software quality across web and mobile platforms.",
    requirements: [
      "Selenium/Cypress",
      "API Testing",
      "Test Automation",
      "JIRA",
    ],
    responsibilities: [
      "Create test strategies",
      "Automate test suites",
      "Report and track bugs",
      "Collaborate with developers",
      "Ensure release quality",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Remote flexibility",
      "Training budget",
      "Team events",
    ],
  },
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
    },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
    heroCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    heroRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
    companyLogo: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    companyLogoText: {
      fontSize: 12,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
      textAlign: "center",
    },
    heroInfo: { flex: 1 },
    jobTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 3,
    },
    companyName: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    metaRow: { flexDirection: "row", gap: 20 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
    metaText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    divider: { height: 1, backgroundColor: colors.border, marginBottom: 16 },
    descriptionBody: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 20,
    },
    section: { marginBottom: 24 },
    sectionTitle: {
      fontSize: 17,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 10,
    },
    bulletItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 8,
    },
    bulletDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.tint,
      marginTop: 7,
    },
    bulletText: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      lineHeight: 22,
    },
    benefitItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 8,
    },
    tagRow: { flexDirection: "row", gap: 8 },
    tag: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.tagBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tagText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.tagText,
    },
    tagsTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    timeAgoText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingTop: 12,
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    applyButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.tint,
      borderRadius: 14,
      paddingVertical: 16,
    },
    applyButtonText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
    },
  });
}

export default function JobDetailScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [bookmarked, setBookmarked] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const job = JOBS_DATA[id ?? "1"];

  if (!job) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.emptyState}>
          <Feather name="alert-circle" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Job not found</Text>
        </View>
      </View>
    );
  }

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
        <Pressable
          style={styles.headerBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Job Details</Text>
        <Pressable
          style={styles.headerBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setBookmarked(!bookmarked);
          }}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={bookmarked ? colors.tint : colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View
              style={[
                styles.companyLogo,
                { backgroundColor: job.companyColor },
              ]}
            >
              <Text style={styles.companyLogoText}>{job.companyLabel}</Text>
            </View>
            <View style={styles.heroInfo}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="location-outline"
                size={15}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="cash-outline"
                size={15}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>{job.salary}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.descriptionBody}>{job.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements.map((req) => (
            <View key={req} style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{req}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tagsTimeRow}>
          <View style={styles.tagRow}>
            {job.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.timeAgoText}>{job.timeAgo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsibilities</Text>
          {job.responsibilities.map((r) => (
            <View key={r} style={styles.bulletItem}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{r}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {job.benefits.map((b) => (
            <View key={b} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 : Math.max(insets.bottom, 16),
          },
        ]}
      >
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
    </View>
  );
}
