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
import { useThemeColors } from "@/constants/useThemeColors";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface Application {
  id: string;
  title: string;
  company: string;
  companyColor: string;
  companyLabel: string;
  dateApplied: string;
  status: "Applied" | "Interview" | "Rejected";
}

const APPLICATIONS: Application[] = [
  {
    id: "1",
    title: "Full Stack Developer",
    company: "PT Uniclov Int.",
    companyColor: "#DC2626",
    companyLabel: "UC",
    dateApplied: "Feb 10, 2026",
    status: "Applied",
  },
  {
    id: "2",
    title: "React Native Wizard",
    company: "Bullshit Incorporated",
    companyColor: "#1E3A5F",
    companyLabel: "BI",
    dateApplied: "Feb 5, 2026",
    status: "Interview",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "PixelCraft Studio",
    companyColor: "#EC4899",
    companyLabel: "PC",
    dateApplied: "Jan 28, 2026",
    status: "Rejected",
  },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Applied: { bg: "#DBEAFE", text: "#2563EB" },
  Interview: { bg: "#D1FAE5", text: "#059669" },
  Rejected: { bg: "#FEE2E2", text: "#DC2626" },
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
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
    companyLogo: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    companyLogoText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#FFFFFF",
    },
    cardInfo: { flex: 1 },
    cardTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginBottom: 2,
    },
    cardCompany: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    cardBottom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    dateRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    dateText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 12,
    },
    statusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  });
}

export default function ApplicationsScreen() {
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
    <ProtectedRoute>
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            {
              paddingTop:
                (Platform.OS === "web" ? webTopInset : insets.top) + 8,
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
          <Text style={styles.headerTitle}>My Applications</Text>
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
          {APPLICATIONS.map((app) => (
            <Pressable
              key={app.id}
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.companyLogo,
                    { backgroundColor: app.companyColor },
                  ]}
                >
                  <Text style={styles.companyLogoText}>{app.companyLabel}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{app.title}</Text>
                  <Text style={styles.cardCompany}>{app.company}</Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <View style={styles.dateRow}>
                  <Feather
                    name="calendar"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.dateText}>{app.dateApplied}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLORS[app.status].bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: STATUS_COLORS[app.status].text },
                    ]}
                  >
                    {app.status}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}
