import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";

const TYPES = ["Full-time", "Contract", "Part-time", "Internship"];
const LOCATIONS = ["Remote", "Hybrid", "Onsite"];
const EXPERIENCE = ["Entry", "Mid", "Senior", "Lead"];
const SALARIES = ["$60k+", "$90k+", "$120k+", "$160k+", "$200k+"];
const POSTED = ["Past 24h", "Past week", "Past month", "Anytime"];

export default function FiltersScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [types, setTypes] = useState<string[]>(["Full-time"]);
  const [locations, setLocations] = useState<string[]>(["Remote"]);
  const [experience, setExperience] = useState<string>("Senior");
  const [salary, setSalary] = useState<string>("$120k+");
  const [posted, setPosted] = useState<string>("Past week");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [easyApply, setEasyApply] = useState(true);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const totalActive =
    types.length +
    locations.length +
    3 +
    (verifiedOnly ? 1 : 0) +
    (easyApply ? 1 : 0);

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    val: string,
  ) => {
    Haptics.selectionAsync();
    setList(
      list.includes(val) ? list.filter((v) => v !== val) : [...list, val],
    );
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {children}
    </View>
  );

  const ChipRow = ({
    options,
    selected,
    onSelect,
    multi,
  }: {
    options: string[];
    selected: string | string[];
    onSelect: (value: string) => void;
    multi?: boolean;
  }) => (
    <View style={styles.chipGrid}>
      {options.map((opt) => {
        const active = multi
          ? (selected as string[]).includes(opt)
          : selected === opt;
        return (
          <Pressable
            key={opt}
            style={[
              styles.chip,
              active && {
                backgroundColor: colors.tint,
                borderColor: colors.tint,
              },
            ]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.chipText, active && { color: "#FFFFFF" }]}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

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
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Filters</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setTypes([]);
            setLocations([]);
            setExperience("Mid");
            setSalary("$60k+");
            setPosted("Anytime");
            setVerifiedOnly(false);
            setEasyApply(false);
          }}
        >
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Job type">
          <ChipRow
            options={TYPES}
            selected={types}
            multi
            onSelect={(v) => toggle(types, setTypes, v)}
          />
        </Section>

        <Section title="Location">
          <ChipRow
            options={LOCATIONS}
            selected={locations}
            multi
            onSelect={(v) => toggle(locations, setLocations, v)}
          />
        </Section>

        <Section title="Experience">
          <ChipRow
            options={EXPERIENCE}
            selected={experience}
            onSelect={(v) => {
              Haptics.selectionAsync();
              setExperience(v);
            }}
          />
        </Section>

        <Section title="Salary">
          <ChipRow
            options={SALARIES}
            selected={salary}
            onSelect={(v) => {
              Haptics.selectionAsync();
              setSalary(v);
            }}
          />
        </Section>

        <Section title="Date posted">
          <ChipRow
            options={POSTED}
            selected={posted}
            onSelect={(v) => {
              Haptics.selectionAsync();
              setPosted(v);
            }}
          />
        </Section>

        <Section title="Other">
          <View style={styles.card}>
            <View style={[styles.toggleRow, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name="ribbon-outline"
                    size={20}
                    color={colors.tint}
                  />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Verified employers only</Text>
                  <Text style={styles.rowSub}>Hides unverified listings</Text>
                </View>
              </View>
              <Switch
                value={verifiedOnly}
                onValueChange={(v) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setVerifiedOnly(v);
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.toggleRow}>
              <View style={styles.rowLeft}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name="flash-outline"
                    size={20}
                    color={colors.tint}
                  />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Easy apply</Text>
                  <Text style={styles.rowSub}>One-tap applications</Text>
                </View>
              </View>
              <Switch
                value={easyApply}
                onValueChange={(v) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setEasyApply(v);
                }}
                trackColor={{ false: colors.border, true: colors.tint }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </Section>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 12,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.applyBtn,
            pressed && { opacity: 0.85 },
          ]}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          }}
        >
          <Text style={styles.applyBtnText}>
            Show results · {totalActive} filters
          </Text>
        </Pressable>
      </View>
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
    resetText: {
      fontSize: 14,
      color: colors.tint,
      fontFamily: "Inter_600SemiBold",
    },
    content: { padding: 20, paddingBottom: 40 },
    sectionLabel: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.textSecondary,
      marginBottom: 12,
      marginLeft: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
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
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
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
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    applyBtn: {
      backgroundColor: colors.tint,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    applyBtnText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
