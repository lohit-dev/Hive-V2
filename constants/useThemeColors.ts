import { useTheme } from "contexts/ThemeContext";
import Colors from "./colors";

export type ColorScheme = "light" | "dark";

export function useThemeColors() {
  const { colorScheme } = useTheme();
  return colorScheme === "dark" ? Colors.dark : Colors.light;
}
