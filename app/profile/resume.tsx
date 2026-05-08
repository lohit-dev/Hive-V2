import { Feather, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
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
import { confirmAction } from "@/utils/confirm";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type ResumeFile = {
  id: string;
  name: string;
  sizeKb: number;
  uploaded: string;
  isPrimary: boolean;
};

const INITIAL_RESUMES: ResumeFile[] = [
  {
    id: "r1",
    name: "Alex Morgan – Senior Designer.pdf",
    sizeKb: 248,
    uploaded: "Apr 18, 2026",
    isPrimary: true,
  },
  {
    id: "r2",
    name: "Alex Morgan – Product Lead.pdf",
    sizeKb: 312,
    uploaded: "Mar 02, 2026",
    isPrimary: false,
  },
  {
    id: "r3",
    name: "Alex Morgan – Concise.pdf",
    sizeKb: 184,
    uploaded: "Jan 27, 2026",
    isPrimary: false,
  },
];

export default function ResumeScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [resumes, setResumes] = useState<ResumeFile[]>(INITIAL_RESUMES);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const setPrimary = (id: string) => {
    Haptics.selectionAsync();
    setResumes((prev) => prev.map((r) => ({ ...r, isPrimary: r.id === id })));
  };

  const removeResume = (id: string) => {
    const target = resumes.find((r) => r.id === id);
    confirmAction({
      title: "Delete resume?",
      message: target
        ? `"${target.name}" will be removed from your profile.`
        : "This can't be undone.",
      confirmText: "Delete",
      destructive: true,
      onConfirm: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setResumes((prev) => {
          const next = prev.filter((r) => r.id !== id);
          if (
            target?.isPrimary &&
            next.length > 0 &&
            !next.some((r) => r.isPrimary)
          ) {
            next[0] = { ...next[0], isPrimary: true };
          }
          return next;
        });
      },
    });
  };

  const onUpload = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      const sizeKb = asset.size
        ? Math.max(1, Math.round(asset.size / 1024))
        : 0;
      const next: ResumeFile = {
        id: `r${Date.now()}`,
        name: asset.name ?? "Resume.pdf",
        sizeKb,
        uploaded: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        isPrimary: resumes.length === 0,
      };
      setResumes((prev) => [next, ...prev]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.warn("Document picker failed", e);
    }
  };

  const formatSize = (kb: number) =>
    kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

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
          <Pressable
            style={styles.headerBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>My resumes</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom:
                Platform.OS === "web" ? 40 : Math.max(insets.bottom, 24),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={({ pressed }) => [
              styles.uploadCard,
              pressed && { opacity: 0.85 },
            ]}
            onPress={onUpload}
          >
            <View style={styles.uploadIcon}>
              <Feather name="upload-cloud" size={26} color={colors.tint} />
            </View>
            <Text style={styles.uploadTitle}>Upload a PDF</Text>
            <Text style={styles.uploadSub}>
              Tap to choose a file from your device · Max 10 MB
            </Text>
          </Pressable>

          <Text style={styles.sectionLabel}>
            {resumes.length} file{resumes.length === 1 ? "" : "s"}
          </Text>

          {resumes.length === 0 ? (
            <View style={styles.emptyCard}>
              <Feather
                name="file-text"
                size={28}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyTitle}>No resumes yet</Text>
              <Text style={styles.emptySub}>
                Upload a PDF to start applying to jobs.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {resumes.map((r) => (
                <View key={r.id} style={styles.fileCard}>
                  <View style={styles.fileIcon}>
                    <Feather name="file-text" size={22} color={colors.tint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.fileTopRow}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {r.name}
                      </Text>
                      {r.isPrimary && (
                        <View style={styles.primaryBadge}>
                          <Text style={styles.primaryBadgeText}>Primary</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.fileMeta}>
                      {formatSize(r.sizeKb)} · Uploaded {r.uploaded}
                    </Text>
                    <View style={styles.fileActions}>
                      {!r.isPrimary && (
                        <Pressable
                          style={({ pressed }) => [
                            styles.actionBtn,
                            pressed && { opacity: 0.6 },
                          ]}
                          onPress={() => setPrimary(r.id)}
                        >
                          <Feather name="star" size={13} color={colors.tint} />
                          <Text style={styles.actionText}>Make primary</Text>
                        </Pressable>
                      )}
                      <Pressable
                        style={({ pressed }) => [
                          styles.actionBtn,
                          pressed && { opacity: 0.6 },
                        ]}
                        onPress={() =>
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                        }
                      >
                        <Feather
                          name="download"
                          size={13}
                          color={colors.text}
                        />
                        <Text
                          style={[styles.actionText, { color: colors.text }]}
                        >
                          Download
                        </Text>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [
                          styles.actionBtn,
                          pressed && { opacity: 0.6 },
                        ]}
                        onPress={() => removeResume(r.id)}
                      >
                        <Feather name="trash-2" size={13} color="#EF4444" />
                        <Text style={[styles.actionText, { color: "#EF4444" }]}>
                          Delete
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.tipCard}>
            <Feather name="info" size={16} color={colors.tint} />
            <Text style={styles.tipText}>
              Your primary resume is sent automatically when you tap Apply.
            </Text>
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
    content: { padding: 20 },
    uploadCard: {
      alignItems: "center",
      padding: 24,
      borderRadius: 18,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: colors.tint,
      backgroundColor: colors.tintLight,
      marginBottom: 24,
    },
    uploadIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    uploadTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.text,
    },
    uploadSub: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
      textAlign: "center",
    },
    sectionLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.textSecondary,
      marginBottom: 10,
      marginLeft: 4,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    emptyCard: {
      alignItems: "center",
      padding: 28,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      gap: 8,
    },
    emptyTitle: {
      fontSize: 15,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    emptySub: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    fileCard: {
      flexDirection: "row",
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    fileIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    fileTopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    fileName: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontFamily: "Inter_600SemiBold",
    },
    primaryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
      backgroundColor: colors.tint,
    },
    primaryBadgeText: {
      fontSize: 10,
      color: "#FFFFFF",
      fontFamily: "Inter_700Bold",
      letterSpacing: 0.4,
    },
    fileMeta: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
    },
    fileActions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.categoryBg,
    },
    actionText: {
      fontSize: 12,
      color: colors.tint,
      fontFamily: "Inter_500Medium",
    },
    tipCard: {
      flexDirection: "row",
      gap: 8,
      alignItems: "flex-start",
      padding: 14,
      borderRadius: 12,
      backgroundColor: colors.tintLight,
      marginTop: 20,
    },
    tipText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      color: colors.text,
      fontFamily: "Inter_500Medium",
    },
  });
}
