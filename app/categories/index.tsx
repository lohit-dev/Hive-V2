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

interface Category {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: Category[] = [
  { name: "IT & Engineering", icon: "desktop-outline" },
  { name: "Education", icon: "school-outline" },
  { name: "Finance", icon: "cash-outline" },
  { name: "Healthcare", icon: "pulse-outline" },
  { name: "Creative Arts", icon: "color-palette-outline" },
  { name: "Marketing", icon: "megaphone-outline" },
  { name: "Legal", icon: "briefcase-outline" },
  { name: "Sales", icon: "cart-outline" },
  { name: "Human Resources", icon: "people-outline" },
  { name: "Customer Service", icon: "headset-outline" },
  { name: "Manufacturing", icon: "construct-outline" },
  { name: "Real Estate", icon: "home-outline" },
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
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 14,
    },
    categoryCard: {
      width: "47%",
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    categoryName: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
      textAlign: "center",
    },
  });
}

export default function CategoriesScreen() {
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
        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
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
                  { backgroundColor: colors.categoryBg },
                ]}
              >
                <Ionicons name={cat.icon} size={28} color={colors.text} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
