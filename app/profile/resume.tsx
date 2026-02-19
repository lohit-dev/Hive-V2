import { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
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
import { useThemeColors } from "constants/useThemeColors";

const EXPERIENCE = [
  {
    title: "Senior Full Stack Developer",
    company: "PT Uniclov Int.",
    period: "Jan 2024 - Present",
    description:
      "Lead development of scalable web applications using React, Node.js, and PostgreSQL. Managed a team of 4 engineers.",
  },
  {
    title: "Frontend Developer",
    company: "Technoverse Solutions",
    period: "Mar 2021 - Dec 2023",
    description:
      "Built responsive user interfaces with React and TypeScript. Improved page load performance by 40%.",
  },
];

const EDUCATION = [
  {
    degree: "Bachelor of Computer Science",
    school: "Bandung Institute of Technology",
    period: "2017 - 2021",
  },
];

const SKILLS = [
  "React",
  "React Native",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "GraphQL",
  "AWS",
  "Docker",
  "Git",
  "Figma",
];

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
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    avatarText: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
    profileName: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.text,
    },
    profileTitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      marginTop: 2,
      marginBottom: 14,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 6,
    },
    contactText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    section: { marginBottom: 24 },
    sectionTitle: {
      fontSize: 17,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 12,
    },
    entryCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    entryHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
    entryDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.tint,
      marginTop: 5,
    },
    entryInfo: { flex: 1 },
    entryTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginBottom: 2,
    },
    entryCompany: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.textSecondary,
    },
    entryPeriod: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.tabIconDefault,
      marginTop: 2,
    },
    entryDescription: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      lineHeight: 20,
      marginTop: 10,
      marginLeft: 22,
    },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    skillTag: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.tagBg,
    },
    skillTagText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.tagText,
    },
  });
}

export default function ResumeScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

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
        <Text style={styles.headerTitle}>My Resume</Text>
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
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>KG</Text>
          </View>
          <Text style={styles.profileName}>King Grey</Text>
          <Text style={styles.profileTitle}>Full Stack Developer</Text>
          <View style={styles.contactRow}>
            <Feather name="mail" size={14} color={colors.textSecondary} />
            <Text style={styles.contactText}>kinggrey@email.com</Text>
          </View>
          <View style={styles.contactRow}>
            <Feather name="phone" size={14} color={colors.textSecondary} />
            <Text style={styles.contactText}>+62 812 3456 7890</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {EXPERIENCE.map((exp) => (
            <View key={exp.title} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryDot} />
                <View style={styles.entryInfo}>
                  <Text style={styles.entryTitle}>{exp.title}</Text>
                  <Text style={styles.entryCompany}>{exp.company}</Text>
                  <Text style={styles.entryPeriod}>{exp.period}</Text>
                </View>
              </View>
              <Text style={styles.entryDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {EDUCATION.map((edu) => (
            <View key={edu.degree} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View
                  style={[styles.entryDot, { backgroundColor: "#F59E0B" }]}
                />
                <View style={styles.entryInfo}>
                  <Text style={styles.entryTitle}>{edu.degree}</Text>
                  <Text style={styles.entryCompany}>{edu.school}</Text>
                  <Text style={styles.entryPeriod}>{edu.period}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsWrap}>
            {SKILLS.map((skill) => (
              <View key={skill} style={styles.skillTag}>
                <Text style={styles.skillTagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
