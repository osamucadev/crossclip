import { YStack } from "tamagui";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon } from "@tamagui/lucide-icons";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <YStack
      width={44}
      height={44}
      borderRadius={22}
      alignItems="center"
      justifyContent="center"
      backgroundColor="$surface"
      borderWidth={1}
      borderColor="$borderColor"
      pressStyle={{
        scale: 0.95,
        backgroundColor: "$surfaceHover",
      }}
      onPress={toggleTheme}
      cursor="pointer"
    >
      {theme === "light" ? (
        <Sun size={20} color="$color" />
      ) : (
        <Moon size={20} color="$color" />
      )}
    </YStack>
  );
}
