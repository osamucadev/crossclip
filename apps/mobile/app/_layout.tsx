import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { registerClipboardSuggestionListener } from "../src/lib/clipboardSuggestion";
import "react-native-reanimated";
import { useEffect } from "react";
import { AuthProvider } from "../src/contexts/AuthContext";

function RootNavigator() {
  useEffect(() => {
    const unsubClipboard = registerClipboardSuggestionListener({
      onSaved: () => router.replace("/clipboard"),
    });

    return unsubClipboard;
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
