import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from "react-native";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    const stored = await AsyncStorage.getItem("app_theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }

  async function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Troca o tema quando totalmente invisível
      setTheme(newTheme);
      AsyncStorage.setItem("app_theme", newTheme);

      // Pequeno delay antes do fade in
      setTimeout(() => {
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 50);
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {children}
      </Animated.View>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
