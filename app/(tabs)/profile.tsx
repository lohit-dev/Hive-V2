import { useMemo } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
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
import { useNotificationStore } from "@/stores/notificationStore";
import { hp } from "@/utils/helper";
import {
  FadeInView,
  ScaleInView,
  AnimatedPressable,
} from "@/components/animated";

const MENU_ITEMS = [
  {
    icon: "briefcase" as const,
    label: "My Applications",
    badge: "3",
    href: "/profile/applications",
  },
  {
    icon: "file-text" as const,
    label: "My Resume",
    badge: null,
    href: "/profile/resume",
  },
  {
    icon: "bell" as const,
    label: "Notifications",
    badge: null, // Will be set dynamically
    href: "/profile/notifications",
  },
  {
    icon: "settings" as const,
    label: "Settings",
    badge: null,
    href: "/profile/settings",
  },
  {
    icon: "help-circle" as const,
    label: "Help & Support",
    badge: null,
    href: "/profile/help",
  },
];

function createStyles(colors: ReturnType<typeof useThemeColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "android" ? hp(4) : 0,
    },
    scrollContent: { paddingHorizontal: 20 },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      marginBottom: 20,
    },
    profileCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatarContainer: { position: "relative", marginBottom: 12 },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.tint,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
    profileName: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.text,
    },
    profileRole: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      marginTop: 2,
      marginBottom: 20,
    },
    statsRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "center",
    },
    statItem: { alignItems: "center", flex: 1 },
    statValue: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      marginTop: 2,
    },
    statDivider: { width: 1, height: 32, backgroundColor: colors.border },
    menuContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginBottom: 24,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    menuLabel: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.text,
    },
    menuRight: { flexDirection: "row", alignItems: "center", gap: 8 },
    menuBadge: {
      backgroundColor: colors.notification,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
    },
    menuBadgeText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "#FFFFFF",
    },
    logoutBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#FECACA",
    },
    logoutText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: "#DC2626",
    },
  });
}

export default function ProfileScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const displayName = user?.name ?? "Guest";
  const displayTitle = user?.title ?? "Add a job title";
  const initials = displayName
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const menuItems = MENU_ITEMS.map((item) => {
    if (item.label === "Notifications") {
      return {
        ...item,
        badge: unreadCount > 0 ? String(unreadCount) : null,
      };
    }
    return item;
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: (Platform.OS === "web" ? webTopInset : 0) + 16,
            paddingBottom: Platform.OS === "web" ? 84 + 34 : insets.bottom + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <FadeInView delay={0} fromY={-20}>
          <Text style={styles.title}>Profile</Text>
        </FadeInView>

        <ScaleInView delay={100} fromScale={0.9}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {user?.avatarUri ? (
                <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
            </View>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileRole}>{displayTitle}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Applied</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Interviews</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
            </View>
          </View>
        </ScaleInView>

        <FadeInView delay={200} fromY={20}>
          <View style={styles.menuContainer}>
            {menuItems.map((item, idx) => (
              <FadeInView key={item.label} delay={250 + idx * 40} fromY={10}>
                <AnimatedPressable
                  style={styles.menuItem}
                  scaleValue={0.97}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(item.href as never);
                  }}
                >
                  <View style={styles.menuIconContainer}>
                    <Feather name={item.icon} size={20} color={colors.tint} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <View style={styles.menuRight}>
                    {item.badge && (
                      <ScaleInView delay={0} fromScale={0}>
                        <View style={styles.menuBadge}>
                          <Text style={styles.menuBadgeText}>{item.badge}</Text>
                        </View>
                      </ScaleInView>
                    )}
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </View>
                </AnimatedPressable>
              </FadeInView>
            ))}
          </View>
        </FadeInView>

        <FadeInView delay={450} fromY={20}>
          <AnimatedPressable
            style={styles.logoutBtn}
            scaleValue={0.96}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await signOut();
              router.replace("/auth/welcome" as never);
            }}
          >
            <Feather name="log-out" size={18} color="#DC2626" />
            <Text style={styles.logoutText}>Log Out</Text>
          </AnimatedPressable>
        </FadeInView>
      </ScrollView>
    </View>
  );
}
