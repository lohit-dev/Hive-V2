import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useThemeColors } from "@/constants/useThemeColors";
import { useAuthStore } from "@/stores/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EditProfileScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [title, setTitle] = useState(user?.title ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [about, setAbout] = useState(user?.about ?? "");
  const [avatarUri, setAvatarUri] = useState(user?.avatarUri);
  const [saving, setSaving] = useState(false);

  const webTopInset = Platform.OS === "web" ? 67 : 0;

  const pickAvatar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      if (Platform.OS !== "web") {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert(
            "Permission needed",
            "Please allow access to your photos to change your profile picture.",
          );
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images" as ImagePicker.MediaType],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.length) return;
      setAvatarUri(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      console.warn("Image picker failed", e);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const onSave = async () => {
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await updateUser({
        name,
        email,
        title,
        location,
        phone,
        about,
        avatarUri,
      });
      Alert.alert("Saved", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setSaving(false);
    }
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
          <Text style={styles.headerTitle}>Edit profile</Text>
          <Pressable
            onPress={onSave}
            disabled={saving}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.saveText}>{saving ? "Saving…" : "Save"}</Text>
          </Pressable>
        </View>

        <KeyboardAwareScrollViewCompat
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bottomOffset={20}
        >
          <View style={styles.avatarSection}>
            <Pressable onPress={pickAvatar}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(name || "U").charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </Pressable>
            <Pressable style={styles.changePhoto} onPress={pickAvatar}>
              <Ionicons name="camera-outline" size={16} color={colors.tint} />
              <Text style={styles.changePhotoText}>Change photo</Text>
            </Pressable>
          </View>

          {[
            {
              label: "Full name",
              value: name,
              set: setName,
              placeholder: "Your name",
              icon: "person-outline" as const,
            },
            {
              label: "Email",
              value: email,
              set: setEmail,
              placeholder: "you@company.com",
              icon: "mail-outline" as const,
              keyboard: "email-address" as const,
              autoCapitalize: "none" as const,
            },
            {
              label: "Job title",
              value: title,
              set: setTitle,
              placeholder: "e.g. Senior Designer",
              icon: "briefcase-outline" as const,
            },
            {
              label: "Location",
              value: location,
              set: setLocation,
              placeholder: "City, Country",
              icon: "location-outline" as const,
            },
            {
              label: "Phone",
              value: phone,
              set: setPhone,
              placeholder: "+1 555 000 0000",
              icon: "call-outline" as const,
              keyboard: "phone-pad" as const,
            },
          ].map((field) => (
            <View key={field.label} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputWrap}>
                <Ionicons
                  name={field.icon}
                  size={18}
                  color={colors.textSecondary}
                />
                <TextInput
                  value={field.value}
                  onChangeText={field.set}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.textSecondary}
                  style={styles.input}
                  keyboardType={field.keyboard ?? "default"}
                  autoCapitalize={field.autoCapitalize ?? "sentences"}
                />
              </View>
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>About</Text>
            <View style={[styles.inputWrap, styles.textareaWrap]}>
              <TextInput
                value={about}
                onChangeText={setAbout}
                placeholder="Tell employers about yourself"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, styles.textarea]}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </View>
        </KeyboardAwareScrollViewCompat>
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
    content: { padding: 20, paddingBottom: 40 },
    avatarSection: { alignItems: "center", marginBottom: 28 },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.tintLight,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 32,
      color: colors.tint,
      fontFamily: "Inter_700Bold",
    },
    changePhoto: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 12,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.tintLight,
    },
    changePhotoText: {
      color: colors.tint,
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    field: { marginBottom: 16 },
    label: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "Inter_500Medium",
      marginBottom: 6,
      marginLeft: 2,
    },
    inputWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === "ios" ? 14 : 8,
    },
    textareaWrap: { alignItems: "flex-start", paddingVertical: 12 },
    input: {
      flex: 1,
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: colors.text,
    },
    textarea: { minHeight: 100 },
  });
}
