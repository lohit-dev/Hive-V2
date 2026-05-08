import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Colors from "@/constants/colors";

export type ColorSchemePreference = "light" | "dark" | "system";

type ThemeState = {
  preference: ColorSchemePreference;
  setPreference: (pref: ColorSchemePreference) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      setPreference: (pref: ColorSchemePreference) => {
        set({ preference: pref });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useResolvedTheme() {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((state) => state.preference);

  const resolvedScheme: "light" | "dark" =
    preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const colors = resolvedScheme === "dark" ? Colors.dark : Colors.light;

  return {
    colorScheme: resolvedScheme,
    colors,
    preference,
  };
}
