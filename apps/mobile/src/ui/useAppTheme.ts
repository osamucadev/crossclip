import { useColorScheme } from "react-native";
import { theme, ThemeName } from "./theme";

export function useAppTheme() {
  const scheme = (useColorScheme() ?? "light") as ThemeName;
  const t = theme[scheme === "dark" ? "dark" : "light"];

  return { name: scheme === "dark" ? "dark" : "light", t };
}
