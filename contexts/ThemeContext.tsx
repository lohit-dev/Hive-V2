import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext } from "react";
import Colors from "constants/colors";

export type ColorSchemeType = "light" | "dark";

type ThemeContextType = {
  colorScheme: ColorSchemeType;
  setColorScheme: (scheme: ColorSchemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] =
    React.useState<ColorSchemeType>("light");

  const value: ThemeContextType = {
    colorScheme,
    setColorScheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
