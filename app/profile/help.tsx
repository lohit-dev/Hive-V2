import { useState, useMemo } from "react";
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
import { useThemeColors } from "@/constants/useThemeColors";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I apply for a job?",
    answer:
      "Browse job listings, tap on a job you are interested in to see the details, and click the 'Apply Now' button. You will need to have your resume uploaded and your profile completed before applying.",
  },
  {
    question: "How do I save jobs for later?",
    answer:
      "Tap the bookmark icon on any job card or on the job detail page. You can find all your saved jobs in the Bookmarks tab at the bottom of the app.",
  },
  {
    question: "How can I update my resume?",
    answer:
      "Go to your Profile, tap 'My Resume', and you can update your experience, education, skills, and contact information from there.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team by emailing kinggreydev@gmail.com or calling +91 7075753289. Our team is available Monday to Friday, 9 AM to 6 PM.",
  },
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
    sectionTitle: {
      fontSize: 17,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 12,
    },
    faqContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginBottom: 28,
    },
    faqItem: { paddingVertical: 16, paddingHorizontal: 16 },
    faqItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    faqHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    faqQuestion: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginRight: 12,
    },
    faqAnswer: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      lineHeight: 22,
      marginTop: 10,
    },
    contactCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 24,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 8,
    },
    contactIconContainer: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    contactLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      marginBottom: 2,
    },
    contactValue: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.text,
    },
    contactDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
    legalCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 24,
    },
    legalTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginBottom: 8,
    },
    legalText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 6,
    },
  });
}

export default function HelpScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const toggleFaq = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
        <Text style={styles.headerTitle}>Help & Support</Text>
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
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqContainer}>
          {FAQ_ITEMS.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.faqItem,
                index < FAQ_ITEMS.length - 1 && styles.faqItemBorder,
              ]}
              onPress={() => toggleFaq(index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Ionicons
                  name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.textSecondary}
                />
              </View>
              {expandedIndex === index && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>

        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Feather name="mail" size={20} color={colors.tint} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>kinggreydev@gmail.com</Text>
            </View>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <Feather name="phone" size={20} color={colors.tint} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+91 7075753289</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Terms & Conditions</Text>
        <View style={styles.legalCard}>
          <Text style={styles.legalTitle}>Usage Terms</Text>
          <Text style={styles.legalText}>
            By using Hive, you agree to provide accurate profile information and
            use the platform responsibly. Do not post misleading, abusive, or
            unlawful content.
          </Text>
          <Text style={styles.legalText}>
            Hive helps connect candidates and employers, but we do not guarantee
            interview calls, offers, or hiring outcomes.
          </Text>
          <Text style={styles.legalText}>
            Your data is used only to deliver job-matching features and improve
            the app experience. You can request account updates or deletion by
            contacting support.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
