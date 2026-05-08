import { useMemo } from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useThemeColors } from "@/constants/useThemeColors";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { hp } from "@/utils/helper";

function createStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "android" ? hp(4) : 0,
    },
    scrollContent: { paddingHorizontal: 20, flex: 1 },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 16,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 120,
      gap: 12,
    },
    emptyIconContainer: {
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
      lineHeight: 20,
      maxWidth: 260,
    },
  });
}

export default function BookmarksScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: (Platform.OS === "web" ? webTopInset : 0) + 16,
              paddingBottom: Platform.OS === "web" ? 84 + 34 : 120,
            },
          ]}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <Text style={styles.title}>Saved Jobs</Text>

          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Feather name="bookmark" size={48} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No saved jobs yet</Text>
            <Text style={styles.emptyText}>
              Tap the bookmark icon on any job to save it here for later
            </Text>
          </View>
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}
