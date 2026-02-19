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

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "match",
    message: "New job match: Senior React Developer at Cloudify Networks",
    timestamp: "2 min ago",
    read: false,
    icon: "briefcase-outline",
    iconColor: "#2563EB",
    iconBg: "#DBEAFE",
  },
  {
    id: "2",
    type: "viewed",
    message:
      "Your application for Full Stack Developer was viewed by PT Uniclov Int.",
    timestamp: "1 hour ago",
    read: false,
    icon: "eye-outline",
    iconColor: "#8B5CF6",
    iconBg: "#EDE9FE",
  },
  {
    id: "3",
    type: "interview",
    message:
      "Interview scheduled for React Native Wizard at Bullshit Incorporated on Feb 25",
    timestamp: "3 hours ago",
    read: false,
    icon: "calendar-outline",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
  },
  {
    id: "4",
    type: "update",
    message: "Your profile has been updated successfully",
    timestamp: "1 day ago",
    read: true,
    icon: "checkmark-circle-outline",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
  },
  {
    id: "5",
    type: "recommendation",
    message: "Based on your profile, we recommend 5 new jobs in your area",
    timestamp: "2 days ago",
    read: true,
    icon: "star-outline",
    iconColor: "#EC4899",
    iconBg: "#FCE7F3",
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
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
    notifCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    notifUnread: {
      backgroundColor: colors.tintLight,
      borderColor: colors.tintLight,
    },
    notifIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    notifContent: { flex: 1 },
    notifMessage: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 4,
    },
    notifMessageUnread: { fontFamily: "Inter_500Medium", color: colors.text },
    notifTime: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.tabIconDefault,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.tint,
      marginTop: 6,
    },
  });
}

export default function NotificationsScreen() {
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
        <Text style={styles.headerTitle}>Notifications</Text>
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
        {NOTIFICATIONS.map((notif) => (
          <Pressable
            key={notif.id}
            style={({ pressed }) => [
              styles.notifCard,
              !notif.read && styles.notifUnread,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          >
            <View style={[styles.notifIcon, { backgroundColor: notif.iconBg }]}>
              <Ionicons name={notif.icon} size={20} color={notif.iconColor} />
            </View>
            <View style={styles.notifContent}>
              <Text
                style={[
                  styles.notifMessage,
                  !notif.read && styles.notifMessageUnread,
                ]}
              >
                {notif.message}
              </Text>
              <Text style={styles.notifTime}>{notif.timestamp}</Text>
            </View>
            {!notif.read && <View style={styles.unreadDot} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
