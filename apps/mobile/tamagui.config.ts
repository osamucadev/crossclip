import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

const appConfig = createTamagui({
  ...config,
  themes: {
    light: {
      background: "#fafaf9",
      backgroundHover: "#f5f5f4",
      backgroundPress: "#e7e5e4",
      backgroundFocus: "#e7e5e4",
      backgroundStrong: "#ffffff",
      backgroundTransparent: "rgba(250, 250, 249, 0)",
      color: "#0c0a09",
      colorHover: "#292524",
      colorPress: "#44403c",
      colorFocus: "#44403c",
      colorTransparent: "rgba(12, 10, 9, 0)",
      borderColor: "#e7e5e4",
      borderColorHover: "#d6d3d1",
      borderColorFocus: "#a8a29e",
      borderColorPress: "#a8a29e",
      placeholderColor: "#a8a29e",
      outlineColor: "#6366f1",

      // Custom tokens
      primary: "#6366f1",
      primaryHover: "#4f46e5",
      surface: "#ffffff",
      surfaceHover: "#f5f5f4",
      muted: "#78716c",
      mutedForeground: "#57534e",
    },
    dark: {
      background: "#1c1917",
      backgroundHover: "#292524",
      backgroundPress: "#44403c",
      backgroundFocus: "#44403c",
      backgroundStrong: "#0c0a09",
      backgroundTransparent: "rgba(28, 25, 23, 0)",
      color: "#fafaf9",
      colorHover: "#e7e5e4",
      colorPress: "#d6d3d1",
      colorFocus: "#d6d3d1",
      colorTransparent: "rgba(250, 250, 249, 0)",
      borderColor: "#44403c",
      borderColorHover: "#57534e",
      borderColorFocus: "#78716c",
      borderColorPress: "#78716c",
      placeholderColor: "#78716c",
      outlineColor: "#818cf8",

      // Custom tokens
      primary: "#818cf8",
      primaryHover: "#6366f1",
      surface: "#292524",
      surfaceHover: "#44403c",
      muted: "#a8a29e",
      mutedForeground: "#d6d3d1",
    },
  },
});

export type AppConfig = typeof appConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;
