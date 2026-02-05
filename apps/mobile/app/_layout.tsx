import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { registerClipboardSuggestionListener } from "../src/lib/clipboardSuggestion";
import "react-native-reanimated";
import { useEffect } from "react";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider, useTheme } from "../src/contexts/ThemeContext";
import { checkAppVersion, openPlayStore } from "../src/lib/versionControl";
import { Alert } from "react-native";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";

function RootNavigator() {
  const { theme } = useTheme();

  useEffect(() => {
    const unsubClipboard = registerClipboardSuggestionListener({
      onSaved: () => router.replace("/clipboard"),
    });

    return unsubClipboard;
  }, []);

  useEffect(() => {
    async function checkVersion() {
      const status = await checkAppVersion();

      if (status.mustUpdate && !status.canStillUse) {
        Alert.alert(
          "Atualização obrigatória",
          "Você precisa atualizar o app para continuar usando.",
          [
            {
              text: "Atualizar agora",
              onPress: openPlayStore,
            },
          ],
          { cancelable: false },
        );
      } else if (status.mustUpdate && status.canStillUse) {
        Alert.alert(
          "Nova versão disponível",
          `Atualize em breve. Você ainda pode usar o app ${status.opensLeft} vezes.`,
          [
            { text: "Depois", style: "cancel" },
            { text: "Atualizar", onPress: openPlayStore },
          ],
        );
      }
    }

    checkVersion();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="clipboard" />
      </Stack>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <TamaguiProvider config={config} defaultTheme={theme} key={theme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
