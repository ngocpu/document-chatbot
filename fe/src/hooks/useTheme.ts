import { useContext } from "react";
import { ThemeContext } from "@/theme/theme-context";

/** Reads theme state from ThemeProvider; must be used within it. */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
