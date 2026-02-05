import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { registerClipboardSuggestionListener } from "../src/lib/clipboardSuggestion";
import "react-native-reanimated";
import { useEffect } from "react";
import { AuthProvider } from "../src/contexts/AuthContext";
import { checkAppVersion, openPlayStore } from "../src/lib/versionControl";
import { Alert } from "react-native";

function RootNavigator() {
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
        // Force update - block app usage
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
        // Warn but allow usage
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
        {/* <Stack.Screen name="item/[id]" /> */}
        {/* <Stack.Screen name="settings" /> */}
        {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
