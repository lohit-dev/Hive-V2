import { useResolvedTheme } from "@/stores/themeStore";
import Colors from "./colors";

export type ColorScheme = "light" | "dark";

export function useThemeColors() {
  const { colorScheme } = useResolvedTheme();
  return colorScheme === "dark" ? Colors.dark : Colors.light;
}
