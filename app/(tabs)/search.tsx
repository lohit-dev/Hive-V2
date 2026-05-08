import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
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

const RECENT_SEARCHES = [
  "Frontend Developer",
  "React Native",
  "Remote jobs",
  "UI Designer",
];

const TRENDING = [
  { id: "1", title: "AI Engineer", count: "2.4k jobs" },
  { id: "2", title: "Product Manager", count: "1.8k jobs" },
  { id: "3", title: "Data Scientist", count: "3.1k jobs" },
  { id: "4", title: "Mobile Developer", count: "1.2k jobs" },
  { id: "5", title: "DevOps Engineer", count: "890 jobs" },
  { id: "6", title: "Cloud Architect", count: "560 jobs" },
];

function createStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingHorizontal: 20 },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 16,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.searchBg,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 48,
      gap: 10,
      marginBottom: 24,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 12,
    },
    recentItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    recentText: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.text,
    },
    trendingItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      gap: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    trendingRank: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    trendingRankText: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
      color: colors.tint,
    },
    trendingInfo: { flex: 1 },
    trendingTitle: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
    },
    trendingCount: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      marginTop: 2,
    },
  });
}

export default function SearchScreen() {
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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : insets.top) + 16,
            paddingBottom: Platform.OS === "web" ? 84 + 34 : 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title}>Search</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Job title, company, or keyword"
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => {
              if (query.trim()) {
                Keyboard.dismiss();
                router.push({
                  pathname: "/search-results",
                  params: { q: query.trim() },
                });
              }
            }}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>

        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {RECENT_SEARCHES.map((search) => (
          <Pressable
            key={search}
            style={({ pressed }) => [
              styles.recentItem,
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({
                pathname: "/search-results",
                params: { q: search },
              });
            }}
          >
            <Feather name="clock" size={18} color={colors.textSecondary} />
            <Text style={styles.recentText}>{search}</Text>
            <Feather
              name="arrow-up-left"
              size={16}
              color={colors.textSecondary}
            />
          </Pressable>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Trending Searches
        </Text>
        {TRENDING.map((item, index) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.trendingItem,
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({
                pathname: "/search-results",
                params: { q: item.title },
              });
            }}
          >
            <View style={styles.trendingRank}>
              <Text style={styles.trendingRankText}>{index + 1}</Text>
            </View>
            <View style={styles.trendingInfo}>
              <Text style={styles.trendingTitle}>{item.title}</Text>
              <Text style={styles.trendingCount}>{item.count}</Text>
            </View>
            <Feather name="trending-up" size={18} color={colors.tint} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
