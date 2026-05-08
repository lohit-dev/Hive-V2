import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
} from "react-native";
import { router } from "expo-router";
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
import { useThemeColors } from "@/constants/useThemeColors";

interface Category {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  jobs: number;
}

const CATEGORIES: Category[] = [
  {
    name: "IT & Engineering",
    icon: "desktop-outline",
    color: "#2563EB",
    jobs: 1284,
  },
  { name: "Education", icon: "school-outline", color: "#F59E0B", jobs: 412 },
  { name: "Finance", icon: "cash-outline", color: "#10B981", jobs: 638 },
  { name: "Healthcare", icon: "pulse-outline", color: "#EF4444", jobs: 921 },
  {
    name: "Creative Arts",
    icon: "color-palette-outline",
    color: "#EC4899",
    jobs: 357,
  },
  { name: "Marketing", icon: "megaphone-outline", color: "#F97316", jobs: 549 },
  { name: "Legal", icon: "briefcase-outline", color: "#6366F1", jobs: 184 },
  { name: "Sales", icon: "cart-outline", color: "#14B8A6", jobs: 712 },
  {
    name: "Human Resources",
    icon: "people-outline",
    color: "#8B5CF6",
    jobs: 268,
  },
  {
    name: "Customer Service",
    icon: "headset-outline",
    color: "#0EA5E9",
    jobs: 495,
  },
  {
    name: "Manufacturing",
    icon: "construct-outline",
    color: "#A16207",
    jobs: 326,
  },
  { name: "Real Estate", icon: "home-outline", color: "#059669", jobs: 207 },
  {
    name: "Hospitality",
    icon: "restaurant-outline",
    color: "#DB2777",
    jobs: 388,
  },
  { name: "Logistics", icon: "car-outline", color: "#475569", jobs: 451 },
  {
    name: "Media & Comms",
    icon: "videocam-outline",
    color: "#9333EA",
    jobs: 174,
  },
  { name: "Science & R&D", icon: "flask-outline", color: "#0891B2", jobs: 132 },
];

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
    intro: {
      paddingTop: 4,
      paddingHorizontal: 4,
      paddingBottom: 12,
    },
    introTitle: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 4,
    },
    introSubtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      lineHeight: 20,
    },
    searchWrap: {
      paddingHorizontal: 4,
      paddingBottom: 12,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.searchBg,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 46,
      gap: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.text,
    },
    countRow: {
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 12,
    },
    countText: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: colors.textSecondary,
    },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 4 },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 14,
    },
    categoryCard: {
      width: "47%",
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 132,
      justifyContent: "space-between",
    },
    categoryIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    categoryName: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      marginTop: 14,
    },
    categoryMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
    },
    categoryJobs: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.textSecondary,
    },
    arrowBubble: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.categoryBg,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 48,
      gap: 8,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.textSecondary,
    },
  });
}

export default function CategoriesScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const filtered = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const totalJobs = CATEGORIES.reduce((sum, c) => sum + c.jobs, 0);

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
        <Text style={styles.headerTitle}>All Categories</Text>
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
        <View style={styles.intro}>
          <Text style={styles.introTitle}>Find your field</Text>
          <Text style={styles.introSubtitle}>
            Explore {totalJobs.toLocaleString()} open roles across{" "}
            {CATEGORIES.length} industries.
          </Text>
        </View>

        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories"
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} hitSlop={10}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.textSecondary}
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* <View style={styles.countRow}>
          <Text style={styles.countText}>
            {filtered.length}{" "}
            {filtered.length === 1 ? "category" : "categories"}
          </Text>
        </View> */}

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={40}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>
              No categories match &quot;{query}&quot;
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((cat) => (
              <Pressable
                key={cat.name}
                style={({ pressed }) => [
                  styles.categoryCard,
                  pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push({
                    pathname: "/categories/[id]",
                    params: { id: cat.name },
                  });
                }}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: hexToRgba(cat.color, 0.14) },
                  ]}
                >
                  <Ionicons name={cat.icon} size={22} color={cat.color} />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {cat.name}
                </Text>
                <View style={styles.categoryMeta}>
                  <Text style={styles.categoryJobs}>
                    {cat.jobs.toLocaleString()} jobs
                  </Text>
                  <View style={styles.arrowBubble}>
                    <Ionicons
                      name="arrow-forward"
                      size={12}
                      color={colors.text}
                    />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
