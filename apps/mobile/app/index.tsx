import {
  configureGoogleSignIn,
  signInWithGoogle,
} from "@/src/lib/googleSignIn";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";

export default function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  async function handleLogin() {
    try {
      const userCred = await signInWithGoogle();
      Alert.alert("Logged in", userCred.user.email ?? "ok");
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "unknown error");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f4f6" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 18 }}>
        <Pressable
          onPress={handleLogin}
          style={{
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 10,
            backgroundColor: "rgba(91, 46, 255, 0.10)",
            borderWidth: 1,
            borderColor: "rgba(91, 46, 255, 0.25)",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#0b0b0f" }}>
            Sign in with Google
          </Text>
        </Pressable>

        <View style={{ height: 18 }} />

        <Text style={{ color: "#4b5563", lineHeight: 24 }}>
          After login, we will sync clips via Firestore.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
