import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
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
