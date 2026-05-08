import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const ROLES = [
  "Designer",
  "Engineer",
  "Product",
  "Data",
  "Marketing",
  "Sales",
  "Operations",
];

const TYPES = ["Full-time", "Contract", "Part-time", "Internship"];
const LOCATIONS = ["Remote", "Hybrid", "Onsite"];
const EXPERIENCE = ["Entry", "Mid", "Senior", "Lead", "Executive"];

export default function PreferencesScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [roles, setRoles] = useState<string[]>(["Designer", "Product"]);
  const [types, setTypes] = useState<string[]>(["Full-time"]);
  const [locations, setLocations] = useState<string[]>(["Remote", "Hybrid"]);
  const [experience, setExperience] = useState<string>("Senior");
  const [minSalary, setMinSalary] = useState("120");
  const [openToOffers, setOpenToOffers] = useState(true);
  const [relocation, setRelocation] = useState(false);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const toggle = (
    list: string[],
    setList: (next: string[]) => void,
    value: string,
  ) => {
    Haptics.selectionAsync();
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  };

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
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Job preferences</Text>
          <Pressable
            onPress={() => {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              Alert.alert("Saved", "Your preferences are up to date.");
              router.back();
            }}
          >
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom:
                Platform.OS === "web" ? 34 : Math.max(insets.bottom, 16),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Roles I want</Text>
          <View style={styles.chipGrid}>
            {ROLES.map((r) => {
              const active = roles.includes(r);
              return (
                <Pressable
                  key={r}
                  style={[
                    styles.chip,
                    active && {
                      backgroundColor: colors.tint,
                      borderColor: colors.tint,
                    },
                  ]}
                  onPress={() => toggle(roles, setRoles, r)}
                >
                  <Text
                    style={[styles.chipText, active && { color: "#FFFFFF" }]}
                  >
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Work type</Text>
          <View style={styles.chipGrid}>
            {TYPES.map((t) => {
              const active = types.includes(t);
              return (
                <Pressable
                  key={t}
                  style={[
                    styles.chip,
                    active && {
                      backgroundColor: colors.tint,
                      borderColor: colors.tint,
                    },
                  ]}
                  onPress={() => toggle(types, setTypes, t)}
                >
                  <Text
                    style={[styles.chipText, active && { color: "#FFFFFF" }]}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Location preference</Text>
          <View style={styles.chipGrid}>
            {LOCATIONS.map((l) => {
              const active = locations.includes(l);
              return (
                <Pressable
                  key={l}
                  style={[
                    styles.chip,
                    active && {
                      backgroundColor: colors.tint,
                      borderColor: colors.tint,
                    },
                  ]}
                  onPress={() => toggle(locations, setLocations, l)}
                >
                  <Text
                    style={[styles.chipText, active && { color: "#FFFFFF" }]}
                  >
                    {l}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Experience level</Text>
          <View style={styles.chipGrid}>
            {EXPERIENCE.map((e) => {
              const active = experience === e;
              return (
                <Pressable
                  key={e}
                  style={[
                    styles.chip,
                    active && {
                      backgroundColor: colors.tint,
                      borderColor: colors.tint,
                    },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setExperience(e);
                  }}
                >
                  <Text
                    style={[styles.chipText, active && { color: "#FFFFFF" }]}
                  >
                    {e}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Minimum salary</Text>
          <View style={styles.salaryCard}>
            <Text style={styles.salaryUnit}>$</Text>
            <TextInput
              value={minSalary}
              onChangeText={setMinSalary}
              keyboardType="numeric"
              style={styles.salaryInput}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.salaryUnit}>k / year</Text>
          </View>

          <Text style={styles.sectionLabel}>Other</Text>
          <View style={styles.card}>
            <View style={[styles.toggleRow, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name="paper-plane-outline"
                    size={20}
                    color={colors.tint}
                  />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Open to offers</Text>
                  <Text style={styles.rowSub}>
                    Let recruiters reach out directly
                  </Text>
                </View>
              </View>
              <Switch
                value={openToOffers}
                onValueChange={(v) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setOpenToOffers(v);
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.toggleRow}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name="airplane-outline"
                    size={20}
                    color={colors.tint}
                  />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Open to relocation</Text>
                  <Text style={styles.rowSub}>
                    Willing to move for the right role
                  </Text>
                </View>
              </View>
              <Switch
                value={relocation}
                onValueChange={(v) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRelocation(v);
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ProtectedRoute>
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
    saveText: {
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
      color: colors.tint,
    },
    content: { padding: 20 },
    sectionLabel: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.textSecondary,
      marginBottom: 12,
      marginLeft: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    chipGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 24,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipText: {
      fontSize: 13,
      color: colors.text,
      fontFamily: "Inter_500Medium",
    },
    salaryCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    salaryInput: {
      flex: 1,
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
    },
    salaryUnit: {
      fontSize: 15,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      marginBottom: 24,
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    rowTitle: {
      fontSize: 15,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    rowSub: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
  });
}
