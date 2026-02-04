export type ThemeName = "light" | "dark";

export const tokens = {
  space: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    "2xl": 64,
  },
  radius: {
    sm: 10,
    md: 14,
  },
  font: {
    system: undefined as unknown as string,
  },
};

export const theme = {
  light: {
    bg: "#F4F2EE",
    surface: "rgba(255,255,255,0.72)",
    surface2: "rgba(255,255,255,0.55)",
    text: "#0F0F14",
    textMuted: "rgba(15,15,20,0.70)",
    textSoft: "rgba(15,15,20,0.55)",
    border: "rgba(15,15,20,0.14)",
    borderStrong: "rgba(15,15,20,0.22)",
    accent: "#5B2EFF",
    accentWash: "rgba(91,46,255,0.10)",
    accentWash2: "rgba(91,46,255,0.06)",
  },
  dark: {
    bg: "#050505",
    surface: "rgba(0,0,0,0.55)",
    surface2: "rgba(0,0,0,0.35)",
    text: "rgba(245,245,245,0.92)",
    textMuted: "rgba(245,245,245,0.72)",
    textSoft: "rgba(245,245,245,0.50)",
    border: "#1A1A1A",
    borderStrong: "#2A2A2A",
    accent: "#5B2EFF",
    accentWash: "rgba(91,46,255,0.14)",
    accentWash2: "rgba(91,46,255,0.08)",
  },
} satisfies Record<ThemeName, Record<string, string>>;
