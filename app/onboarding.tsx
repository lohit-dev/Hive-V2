import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeColors } from "@/constants/useThemeColors";
import { useAuthStore } from "@/stores/authStore";

const ROLES = [
  "Designer",
  "Engineer",
  "Product",
  "Data",
  "Marketing",
  "Sales",
  "Operations",
  "Founder",
];

const WORK_TYPES = ["Full-time", "Contract", "Part-time", "Internship"];
const WORK_LOCATION = ["Remote", "Hybrid", "Onsite"];

const STEPS = ["Role", "Work type", "Location"];

export default function OnboardingScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [workLocation, setWorkLocation] = useState<string | null>(null);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const toggleWorkType = (type: string) => {
    setWorkTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const canContinue =
    (step === 0 && role !== null) ||
    (step === 1 && workTypes.length > 0) ||
    (step === 2 && workLocation !== null);

  const onContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await completeOnboarding();
      router.replace("/(tabs)");
    }
  };

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
          onPress={() => (step > 0 ? setStep(step - 1) : router.back())}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.stepLabel}>
          Step {step + 1} of {STEPS.length}
        </Text>
        <Pressable
          onPress={async () => {
            await completeOnboarding();
            router.replace("/(tabs)");
          }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((step + 1) / STEPS.length) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 0 && (
          <>
            <Text style={styles.title}>What kind of work?</Text>
            <Text style={styles.subtitle}>
              We&apos;ll personalize your feed with roles that fit.
            </Text>
            <View style={styles.chipGrid}>
              {ROLES.map((r) => {
                const active = role === r;
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
                    onPress={() => {
                      Haptics.selectionAsync();
                      setRole(r);
                    }}
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
          </>
        )}

        {step === 1 && (
          <>
            <Text style={styles.title}>Work type</Text>
            <Text style={styles.subtitle}>Select all that apply.</Text>
            <View style={styles.chipGrid}>
              {WORK_TYPES.map((t) => {
                const active = workTypes.includes(t);
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
                    onPress={() => toggleWorkType(t)}
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
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Where do you want to work?</Text>
            <Text style={styles.subtitle}>You can change this anytime.</Text>
            <View style={{ gap: 12 }}>
              {WORK_LOCATION.map((loc) => {
                const active = workLocation === loc;
                return (
                  <Pressable
                    key={loc}
                    style={[
                      styles.locRow,
                      active && {
                        borderColor: colors.tint,
                        backgroundColor: colors.tintLight,
                      },
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setWorkLocation(loc);
                    }}
                  >
                    <View style={styles.locLeft}>
                      <View
                        style={[
                          styles.locIcon,
                          active && { backgroundColor: colors.tint },
                        ]}
                      >
                        <Ionicons
                          name={
                            loc === "Remote"
                              ? "globe-outline"
                              : loc === "Hybrid"
                                ? "swap-horizontal-outline"
                                : "business-outline"
                          }
                          size={20}
                          color={active ? "#FFFFFF" : colors.tint}
                        />
                      </View>
                      <View>
                        <Text style={styles.locTitle}>{loc}</Text>
                        <Text style={styles.locDesc}>
                          {loc === "Remote"
                            ? "Work from anywhere"
                            : loc === "Hybrid"
                              ? "Mix of office & home"
                              : "In-office full time"}
                        </Text>
                      </View>
                    </View>
                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={colors.tint}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
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
            styles.primaryBtn,
            !canContinue && { opacity: 0.5 },
            pressed && canContinue && { opacity: 0.85 },
          ]}
          disabled={!canContinue}
          onPress={onContinue}
        >
          <Text style={styles.primaryBtnText}>
            {step === STEPS.length - 1 ? "Get started" : "Continue"}
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
    },
    headerBtn: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      backgroundColor: colors.categoryBg,
    },
    stepLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
    },
    skipText: {
      fontSize: 14,
      color: colors.tint,
      fontFamily: "Inter_600SemiBold",
    },
    progressTrack: {
      height: 4,
      backgroundColor: colors.border,
      marginHorizontal: 24,
      borderRadius: 2,
    },
    progressFill: {
      height: 4,
      backgroundColor: colors.tint,
      borderRadius: 2,
    },
    content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.text,
      letterSpacing: -0.4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 6,
      marginBottom: 24,
    },
    chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipText: {
      fontSize: 14,
      color: colors.text,
      fontFamily: "Inter_500Medium",
    },
    locRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    locLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
    locIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    locTitle: {
      fontSize: 15,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    locDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    footer: {
      paddingHorizontal: 24,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    primaryBtn: {
      backgroundColor: colors.tint,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
