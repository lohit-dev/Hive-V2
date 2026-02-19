import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Switch,
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
import { useTheme } from "contexts/ThemeContext";
import { useThemeColors } from "constants/useThemeColors";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useTheme();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(false);

  // Dark mode toggle reflects the actual resolved color scheme, not just preference
  const isDarkMode = colorScheme === "dark";

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const toggleItems = [
    {
      label: "Push Notifications",
      icon: "notifications-outline" as const,
      value: pushNotifications,
      onToggle: setPushNotifications,
    },
    {
      label: "Email Notifications",
      icon: "mail-outline" as const,
      value: emailNotifications,
      onToggle: setEmailNotifications,
    },
    {
      label: "Dark Mode",
      icon: "moon-outline" as const,
      value: isDarkMode,
      onToggle: (val: boolean) => setColorScheme(val ? "dark" : "light"),
    },
    {
      label: "Location Services",
      icon: "location-outline" as const,
      value: locationServices,
      onToggle: setLocationServices,
    },
  ];

  const accountItems = [
    { label: "Change Password", icon: "lock-closed-outline" as const },
    { label: "Privacy", icon: "shield-outline" as const },
  ];

  const aboutItems = [
    { label: "Terms of Service", icon: "document-text-outline" as const },
    { label: "Privacy Policy", icon: "reader-outline" as const },
    { label: "App Version 1.0.0", icon: "information-circle-outline" as const },
  ];

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
        <Text style={styles.headerTitle}>Settings</Text>
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
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.sectionCard}>
          {toggleItems.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.settingRow,
                index < toggleItems.length - 1 && styles.settingRowBorder,
              ]}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name={item.icon} size={20} color={colors.tint} />
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  item.onToggle(val);
                }}
                trackColor={{
                  false: colors.border,
                  true: colors.tint,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.sectionCard}>
          {accountItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.settingRow,
                index < accountItems.length - 1 && styles.settingRowBorder,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name={item.icon} size={20} color={colors.tint} />
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.sectionCard}>
          {aboutItems.map((item, index) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.settingRow,
                index < aboutItems.length - 1 && styles.settingRowBorder,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name={item.icon} size={20} color={colors.tint} />
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textSecondary}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
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
    sectionLabel: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.textSecondary,
      marginBottom: 10,
      marginLeft: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginBottom: 24,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    settingRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    settingIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    settingLabel: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.text,
    },
  });
}
